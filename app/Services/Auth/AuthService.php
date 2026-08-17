<?php

namespace App\Services\Auth;

use App\Services\Auth\Data\AuthLoginData;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthService
{
    public function __construct(
        private AuthRepository $repository
    )
    {
    }

    public function login(AuthLoginData $dto): array
    {
        $user = $this->repository->getUserByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)) {
            throw new \InvalidArgumentException('invalid_credentials', Response::HTTP_UNAUTHORIZED);
        }

        $plain = $user->createToken('api')->plainTextToken;

        $minutes = config('sanctum.expiration');   // null => no expiry
        $expiresIn = $minutes ? $minutes * 60 : null;

        return [
            'token' => $plain,
            'token_type' => 'Bearer',
            'expires_in' => $expiresIn,
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'roles' => $user->roles->pluck('name'),
            'abilities' => $user->getAllPermissions()->pluck('name'),
        ];
    }
}
