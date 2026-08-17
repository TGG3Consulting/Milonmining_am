<?php

namespace App\Services\Sale\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class SaleFinalData extends Data
{
    public function __construct(
        public string $date
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'date' => 'required|date'
        ];
    }
}
