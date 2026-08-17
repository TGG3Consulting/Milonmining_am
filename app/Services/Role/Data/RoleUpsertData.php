<?php

namespace App\Services\Role\Data;

use Spatie\LaravelData\Data;

final class RoleUpsertData extends Data
{
    /**
     * @param array<int,string>|null $permissions
     */
    public function __construct(
        public string $name,
        public ?array $permissions = null,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
        ];
    }
}
