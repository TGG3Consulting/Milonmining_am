<?php

namespace App\Services\User;

use App\Models\User;
use App\Services\User\Data\UserStoreData;
use App\Services\User\Data\UserUpdateData;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class UserService
{
    public function __construct(
        private UserRepository $repository
    )
    {
    }

    public function list(int $perPage = 50, string $search = null): LengthAwarePaginator
    {
        return $this->repository->list($perPage, $search);
    }

    public function store(UserStoreData $dto): User
    {
        return $this->repository->store($dto);
    }

    public function update(int $id, UserUpdateData $dto): User
    {
        return $this->repository->update($this->repository->getById($id), $dto);
    }

    public function destroy(int $id): void
    {
        $user = $this->repository->getById($id);
        if (Auth::id() === $user->id) {
            throw new \InvalidArgumentException('You cannot delete your own account');
        }
        $user->delete();
    }
}
