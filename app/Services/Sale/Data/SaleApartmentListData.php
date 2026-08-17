<?php

namespace App\Services\Sale\Data;

use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class SaleApartmentListData extends Data
{
    public function __construct(
        public int $limit,
        public int $timezone,
        public ?int $offset,
        public ?SaleStatusEnum $status,
        public ?int $building_id,
        public ?int $floor_id,
        public ?string $number,
        public ?float $square_meter,
        public ?string $search
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'limit' => 'required|integer|gt:0',
            'offset' => 'nullable|integer|gt:0',
            'status' => ['nullable', new Enum(SaleStatusEnum::class)],
            'building_id' => 'nullable|integer|gt:0',
            'floor_id' => 'nullable|integer|gt:0',
            'number' => 'nullable|string',
            'square_meter' => 'nullable|numeric|gt:0',
            'search' => 'nullable|string'
        ];
    }
}
