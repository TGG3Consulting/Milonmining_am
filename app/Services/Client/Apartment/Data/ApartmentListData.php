<?php

namespace App\Services\Client\Apartment\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class ApartmentListData extends Data
{
    public function __construct(
        public ?int $building_id = null,
        public bool $available,
        public ?bool $duplex,
        public ?int $rooms = null,
        public ?float $square_from = null,
        public ?float $price_from = null,
        public ?float $price_to = null,
        public ?int $floor_level = null,
        public ?string $sort = null
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'building_id' => 'nullable|integer|exists:buildings,id',
            'available' => 'boolean',
            'duplex' => 'boolean',
            'rooms' => 'integer|nullable|gt:0',
            'square_from' => 'numeric|nullable|gt:0',
            'price_from' => 'numeric|nullable|gt:0',
            'price_to' => 'numeric|nullable|gt:0',
            'floor_level' => 'integer|nullable|gt:0',
            'sort' => 'nullable|string',
        ];
    }
}
