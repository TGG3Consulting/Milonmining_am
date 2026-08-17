<?php

namespace App\Services\Role\Permission;

use App\Services\Role\Data\Permission\RolePermissionIdsBatchData;
use App\Services\Role\RoleRepository;
use App\Services\Role\RoleService;
use Illuminate\Pagination\CursorPaginator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionService
{
    public function __construct(
        private RoleRepository           $roleRepository,
        private RolePermissionRepository $repository
    )
    {
    }

    public function list(int $roleId, int $perPage = 50, string $search = null): CursorPaginator
    {
        $role = $this->roleRepository->getById($roleId, RoleService::GUARD);
        return $this->repository->list($role, $perPage, $search);
    }

    public function attach(int $roleId, RolePermissionIdsBatchData $dto): array
    {
        $role = $this->roleRepository->getById($roleId, RoleService::GUARD);
        $foundIds = $this->repository->pluckByIds($dto, RoleService::GUARD);

        if ($foundIds->count()) {
            $role->permissions()->syncWithoutDetaching($foundIds);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        }

        $notFound = array_values(array_diff($dto->permission_ids, $foundIds->all()));

        return [
            'permissions_count' => $role->permissions()->count(),
            'attached' => count($foundIds),
            'not_found_ids' => $notFound,
        ];
    }

    public function detach(int $roleId, RolePermissionIdsBatchData $dto): array
    {
        $role = $this->roleRepository->getById($roleId, RoleService::GUARD);
        $foundIds = $this->repository->pluckByIds($dto, RoleService::GUARD);
        $detached = 0;
        if ($foundIds->count()) {
            $detached = $role->permissions()->detach($foundIds);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        }

        return [
            'permissions_count' => $role->permissions()->count(),
            'detached'          => (int) $detached,
        ];
    }
}
