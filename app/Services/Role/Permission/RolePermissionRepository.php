<?php

namespace App\Services\Role\Permission;

use App\Services\Role\Data\Permission\RolePermissionIdsBatchData;
use App\Services\Role\RoleService;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionRepository
{
    public function list(Role $role, int $perPage = 50, string $search = null): CursorPaginator
    {
        return $role->permissions()
            ->select('permissions.id', 'permissions.name', 'permissions.guard_name')
            ->when($search !== '', fn($qq) => $qq->where('permissions.name', 'like', "%{$search}%"))
            ->orderBy('permissions.name')
            ->cursorPaginate($perPage);
    }

    public function pluckByIds(RolePermissionIdsBatchData $dto, string $guardName): Collection
    {
        return Permission::query()
            ->where('guard_name', $guardName)
            ->whereIn('id', $dto->permission_ids)
            ->pluck('id');
    }
}
