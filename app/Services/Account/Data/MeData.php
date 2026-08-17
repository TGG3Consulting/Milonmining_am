<?php

namespace App\Services\Account\Data;


use Spatie\LaravelData\Data;

final class MeData extends Data
{
    /**
     * @param string[] $roles
     * @param string[] $abilities
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public array $roles,
        public array $abilities,
        public bool $is_super_admin = false,
    ) {}
}
