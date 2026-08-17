<?php

namespace App\Services\Auth\Data;

use Spatie\LaravelData\Data;

final class AuthLoginData extends Data
{
    public function __construct(
        public string $email,
        public string $password,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ];
    }
}
