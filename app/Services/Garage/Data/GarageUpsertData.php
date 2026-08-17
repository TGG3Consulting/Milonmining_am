<?php

namespace App\Services\Garage\Data;

use Spatie\LaravelData\Data;

final class GarageUpsertData extends Data
{
    public function __construct(
        public int    $floor_id,
        public string $number,
        public float  $square_meter,
        public float  $price,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'floor_id' => 'required|int|gt:0',
            'number' => 'required|string',
            'square_meter' => 'required|numeric|gt:0',
            'price' => 'required|numeric|gt:0'
        ];
    }
}
