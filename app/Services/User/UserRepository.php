<?php

namespace App\Services\User;

use App\Models\User;
use App\Services\User\Data\UserStoreData;
use App\Services\User\Data\UserUpdateData;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function list(int $perPage = 50, string $search = null): LengthAwarePaginator
    {
        $query = User::query()
            ->with('roles')
            ->orderBy('name');
        if ($search) {
            $query->where(function ($qq) use ($search) {
                $qq->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        return $query->paginate($perPage, ['id', 'name', 'email', 'created_at']);
    }

    public function getById(int $id): User
    {
        return User::query()->findOrFail($id);
    }
    public function store(UserStoreData $dto): User
    {
        $user = User::query()->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
        ]);
        $user->roles()->sync($dto->role_ids);
        return $user;
    }

    public function update(User $user, UserUpdateData $dto): User
    {
        $updateData = [];
        if ($dto->name !== null) {
            $updateData['name'] = $dto->name;
        }
        if ($dto->email !== null) {
            $updateData['email'] = $dto->email;
        }
        if ($dto->password !== null) {
            $updateData['password'] = Hash::make($dto->password);
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        // If role_ids provided, sync them
        if ($dto->role_ids !== null) {
            $user->roles()->sync($dto->role_ids);
        }
        return $user;
    }

}
