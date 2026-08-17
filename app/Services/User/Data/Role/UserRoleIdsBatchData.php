<?php

namespace App\Services\User\Data\Role;

use Spatie\LaravelData\Data;

final class UserRoleIdsBatchData extends Data
{
    /** @param array<int,int> $role_ids */
    public function __construct(public array $role_ids)
    {
    }

    public static function rules(): array
    {
        return [
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', 'min:1'],
        ];
    }
}
