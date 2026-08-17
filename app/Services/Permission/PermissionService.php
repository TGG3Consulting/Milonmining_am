<?php

namespace App\Services\Permission;

use App\Services\Role\RoleService;
use Illuminate\Pagination\LengthAwarePaginator;

class PermissionService
{
    public function __construct(
        private PermissionRepository $repository
    )
    {
    }

    public function list(int $perPage = 50, string $search = null): LengthAwarePaginator
    {
        return $this->repository->list($perPage, $search, RoleService::GUARD);
    }
}
