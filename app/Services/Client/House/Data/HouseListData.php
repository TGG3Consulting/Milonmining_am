<?php

namespace App\Services\Client\House\Data;

use App\Services\House\Enum\HouseStatusEnum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class HouseListData extends Data
{
    public function __construct(
        public bool $available,
        public ?float $price_from,
        public ?float $price_to,
        public ?float $square_from,
        public ?float $terrace_from,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'available' => 'bool',
            'price_from' => 'nullable|numeric|gt:0',
            'price_to' => 'nullable|numeric|gt:0',
            'square_from' => 'nullable|numeric|gt:0',
            'square_to' => 'nullable|numeric|gt:0',
        ];
    }
}
