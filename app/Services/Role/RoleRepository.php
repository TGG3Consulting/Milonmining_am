<?php

namespace App\Services\Role;

use App\Services\Role\Data\RoleUpsertData;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    public function list(string $search = null): Collection
    {
        $query = Role::query()
            ->orderBy('name');
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        return $query->get();
    }

    public function getById(int $roleId, string $guardName): Role
    {
        return Role::query()->where('guard_name', $guardName)->findOrFail($roleId);
    }

    public function getByNameAndGuard(string $name, string $guardName): ?Role
    {
        return Role::query()->where('guard_name', $guardName)->where('name', $name)->first();
    }

    public function store(RoleUpsertData $dto, string $guardName): Role
    {
        return Role::create(['name' => $dto->name, 'guard_name' => $guardName]);
    }

    public function update(Role $role, RoleUpsertData $dto): Role
    {
        $role->update(['name' => $dto->name]);
        return $role;
    }
}
