<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class SyncPermissionsFromRoutes extends Command
{
    protected $signature = 'permissions:sync-from-routes
        {--guard=api : Guard name}
        {--dry : Show what would happen, don\'t change DB}
        {--prune : Delete permissions (on this guard) that are not referenced in routes}';

    protected $description = 'Create (and optionally prune) Spatie permissions by scanning route middleware';

    public function handle(): int
    {
        $guard = (string) $this->option('guard');

        // 1) Gather all permissions mentioned in route middleware
        $mentioned = $this->scanRouteMiddleware();

        // 2) Compare with DB
        $existing  = Permission::query()->where('guard_name', $guard)->pluck('name')->values();
        $toCreate  = $mentioned->diff($existing)->values();
        $toKeep    = $existing->intersect($mentioned)->values();
        $toPrune   = $this->option('prune') ? $existing->diff($mentioned)->values() : collect();

        // 3) Dry run?
        $this->line("Guard: <info>{$guard}</info>");
        $this->line('Found in routes: <info>'. $mentioned->count() .'</info> unique permission names');
        $this->line('Existing in DB: <info>'. $existing->count() .'</info>');
        $this->line('To create: <info>'. $toCreate->count() .'</info>');
        if ($this->option('prune')) {
            $this->line('To prune: <comment>'. $toPrune->count() .'</comment>');
        }

        if ($this->option('dry')) {
            $this->newLine();
            if ($toCreate->isNotEmpty()) {
                $this->info('Would create:');
                $this->table(['permission'], $toCreate->map(fn($n) => [$n])->all());
            }
            if ($this->option('prune') && $toPrune->isNotEmpty()) {
                $this->warn('Would prune:');
                $this->table(['permission'], $toPrune->map(fn($n) => [$n])->all());
            }
            return self::SUCCESS;
        }

        // 4) Apply changes
        foreach ($toCreate as $name) {
            Permission::create(['name' => $name, 'guard_name' => $guard]);
        }
        if ($this->option('prune') && $toPrune->isNotEmpty()) {
            Permission::query()
                ->where('guard_name', $guard)
                ->whereIn('name', $toPrune)
                ->delete();
        }

        // 5) Clear cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->newLine();
        $this->info("Created: {$toCreate->count()}");
        if ($this->option('prune')) {
            $this->warn("Pruned: {$toPrune->count()}");
        }
        $this->line('Done.');
        return self::SUCCESS;
    }

    /**
     * Scan all routes and collect permission names from:
     *  - permission:permA|permB
     *  - role_or_permission:roleA|permC  (we’ll collect all tokens; roles don’t hurt if also added as permissions)
     *  - can:abilityA|abilityB           (optional: treat gates as permissions)
     */
    protected function scanRouteMiddleware(): Collection
    {
        $routes = Route::getRoutes();
        $found  = collect();

        foreach ($routes as $route) {
            foreach ($route->gatherMiddleware() as $mw) {
                if (!is_string($mw)) continue;

                // permission:... or role_or_permission:...
                if (str_starts_with($mw, 'permission:') || str_starts_with($mw, 'role_or_permission:')) {
                    $args = substr($mw, strpos($mw, ':') + 1);
                    $this->pushTokens($found, $args);
                }

                // Optional: treat "can:ability" as a permission name, if you align Gates to permissions
                if (str_starts_with($mw, 'can:')) {
                    $args = substr($mw, 4);
                    $this->pushTokens($found, $args);
                }
            }
        }

        return $found->unique()->sort()->values();
    }

    protected function pushTokens(Collection $acc, string $args): void
    {
        // Split by | , ; to be forgiving
        $tokens = preg_split('/[|,;]+/', $args) ?: [];
        foreach ($tokens as $t) {
            $name = trim($t);
            if ($name !== '') $acc->push($name);
        }
    }
}
