<?php

namespace App\Services\Auth;

use App\Models\User;

class AuthRepository
{
    public function getUserByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }
}
