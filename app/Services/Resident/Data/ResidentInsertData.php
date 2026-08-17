<?php

namespace App\Services\Resident\Data;

use Spatie\LaravelData\Data;

final class ResidentInsertData extends Data
{
    public function __construct(
        public string $name,
        public string $phone,
    )
    {
    }

}
