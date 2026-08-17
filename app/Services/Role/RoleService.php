<?php

namespace App\Services\Role;

use App\Services\Role\Data\RoleUpsertData;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleService
{
    public const GUARD = 'api';

    public function __construct(
        private RoleRepository $repository,
    )
    {
    }

    public function list(string $search = null): Collection
    {
        return $this->repository->list($search);
    }

    public function store(RoleUpsertData $dto): Role
    {
        if ($this->repository->getByNameAndGuard($dto->name, self::GUARD)) {
            throw new \InvalidArgumentException('Role already exists.');
        }
        return $this->repository->store($dto, self::GUARD);
    }

    public function update(int $id, RoleUpsertData $dto): Role
    {
        $role = $this->repository->getById($id, self::GUARD);
        if ($role->name === 'super-admin' && $dto->name !== 'super-admin') {
            throw new \InvalidArgumentException('The super-admin role cannot be renamed.');
        }
        if ($dto->name !== $role->name) {
            if ($this->repository->getByNameAndGuard($dto->name, self::GUARD)) {
                throw new \InvalidArgumentException('Role already exists.');
            }
        }
        return $this->repository->update($role, $dto);
    }

    public function destroy(int $id): void
    {
        $role = $this->repository->getById($id, self::GUARD);
        if ($role->name === 'super-admin') {
            throw new \InvalidArgumentException('The super-admin role cannot be deleted.');
        }
        $assigned = DB::table(config('permission.table_names.model_has_roles', 'model_has_roles'))
            ->where('role_id', $role->id)->count();
        if ($assigned > 0) {
            throw new \InvalidArgumentException('The role is assigned to {$assigned} user(s).');
        }
        $role->delete();
    }
}
