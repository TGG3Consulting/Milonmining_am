<?php

namespace App\Services\Permission;

use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionRepository
{
    public function list(int $perPage = 50, string $search = null, string $guardName = 'api'): LengthAwarePaginator
    {
        return Permission::query()
            ->where('guard_name', $guardName)
            ->when($search !== '', fn($qq) => $qq->where('name','like',"%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage);
    }
}
