<?php

namespace App\Services\Role\Data\Permission;

use Spatie\LaravelData\Data;

final class RolePermissionIdsBatchData extends Data
{
    /**
     * @param array<int,string> $permission_ids
     */
    public function __construct(
        public array $permission_ids,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'permission_ids' => ['required', 'array'],   // no min => [] allowed
            'permission_ids.*' => ['required', 'int', 'gt:0'],
        ];
    }
}
