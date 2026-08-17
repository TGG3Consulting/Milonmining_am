<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the super-admin role exists on the 'api' guard
        $role = Role::firstOrCreate([
            'name'       => 'super-admin',
            'guard_name' => 'api',
        ]);

        // Create (or fetch) the super admin user
        $user = User::firstOrCreate(
            ['email' => 'Milon.mining.company@gmail.com'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('Mayningmilwn.2025'), // change in prod
            ]
        );

        User::where('email', 'Milon.mining.company@gmail.com')->update([
            'password' => Hash::make('Mayningmilwn.2025')
        ]);

        // Assign role (idempotent)
        if (! $user->hasRole($role->name)) {
            $user->assignRole($role); // uses guard 'api' via $guard_name / config
        }

        // Optional: create a dev PAT so you can auth immediately
        if (! app()->environment('production')) {
            $user->tokens()->where('name', 'dev')->delete();
            $token = $user->createToken('dev', ['*'])->plainTextToken;
            $this->command?->info("Super Admin ready: admin@example.com / password");
            $this->command?->warn("Bearer token (dev): {$token}");
        }
    }
}
