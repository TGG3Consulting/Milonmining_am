<?php

namespace App\Services\Apartment\Data;

use App\Services\Apartment\Enum\ApartmentStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class ApartmentListData extends Data
{
    public function __construct(
        public int                  $limit = 20,
        public ?int                 $offset = 0,
        public ?int                 $building_id = null,
        public ?ApartmentStatusEnum $status = null,
        public ?int                 $floor_id = null,
        public ?int                 $rooms = null,
        public ?int                 $number = null,
        public ?float               $square_meter = null,
        public ?bool               $for_main = null,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'limit' => 'required|integer|gte:20',
            'offset' => 'nullable|integer|gte:0',
            'building_id' => 'nullable|integer|gt:0',
            'status' => ['nullable',new Enum(ApartmentStatusEnum::class)],
            'floor_id' => 'nullable|integer|gt:0',
            'rooms' => 'nullable|integer|gt:0',
            'number' => 'nullable|integer|gt:0',
            'square_meter' => 'nullable|numeric|gt:0',
            'for_main' => 'nullable|bool',
        ];
    }
}
