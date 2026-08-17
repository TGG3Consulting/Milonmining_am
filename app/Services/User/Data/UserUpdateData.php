<?php

namespace App\Services\User\Data;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

final class UserUpdateData extends Data
{
    /**
     * @param array<int,int>|null $role_ids
     */
    public function __construct(
        public ?string $name = null,
        public ?string $email = null,
        public ?string $password = null,
        public ?array $role_ids = null,
    ) {}

    public static function rules(): array
    {
        $id = (int) request()->route('id');
        return [
            'name'       => ['sometimes','string','max:100'],
            'email'      => ['sometimes','string','email', Rule::unique('users','email')->ignore($id)],
            'password'   => ['sometimes','string','min:8'],
            'role_ids'   => ['sometimes','array','min:1'],
            'role_ids.*' => ['integer','exists:roles,id'],
        ];
    }
}
