<?php

namespace App\Services\Garage\Data;

use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class GarageListData extends Data
{
    public function __construct(
        public int     $limit = 20,
        public ?int    $offset = null,
        public ?GarageStatusEnum    $status = null,
        public ?string $number = null,
        public ?int    $building_id = null,
        public ?int    $floor_id = null,
        public ?float  $square_meter = null
    )
    {
    }

    public static function rules(): array
    {
        return [
            'limit' => 'required|int',
            'offset' => 'nullable|int',
            'number' => 'nullable|string',
            'status' => ['nullable', new Enum(GarageStatusEnum::class)],
            'building_id' => 'nullable|int|gt:0',
            'floor_id' => 'nullable|int|gt:0',
            'square_meter' => 'nullable|int|gt:0',
        ];
    }
}
