<?php

namespace App\Services\User\Data;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

final class UserStoreData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public array $role_ids
    )
    {
    }

    public static function rules(): array
    {
        $id = (int)request()->route('id'); // safe here

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'role_ids' => ['required', 'array'],
            'role_ids.*' => ['required', 'integer', 'exists:roles,id'],
        ];
    }
}
