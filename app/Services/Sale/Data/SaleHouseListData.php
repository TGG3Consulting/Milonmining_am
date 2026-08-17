<?php

namespace App\Services\Sale\Data;

use App\Services\House\Enum\HouseTypeEnum;
use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class SaleHouseListData extends Data
{
    public function __construct(
        public int $limit,
        public int $timezone,
        public ?int $offset,
        public ?SaleStatusEnum $status,
        public ?HouseTypeEnum $type,
        public ?float $terrace_size,
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
            'type' => ['nullable', new Enum(HouseTypeEnum::class)],
            'terrace_size' => 'nullable|numeric|gt:0',
            'search' => 'nullable|string'
        ];
    }
}
