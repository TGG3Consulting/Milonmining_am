<?php

namespace App\Services\Apartment\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

final class ApartmentInsertData extends Data
{
    public function __construct(
        public int           $building_id,
        public int           $block_id,
        public int           $floor_id,
        public string        $number,
        public int           $rooms,
        public float         $square_meter,
        public bool          $duplex,
        public float         $price = 0,
        public ?UploadedFile $image = null,
        public ?UploadedFile $parent_image = null,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'building_id' => ['required', 'integer', 'gt:0'],
            'block_id' => ['required', 'integer', 'gt:0'],
            'floor_id' => ['required', 'integer', 'gt:0'],
            'number' => ['required', 'string'],
            'price' => ['required', 'numeric', 'gt:0'],
            'rooms' => ['required', 'integer', 'gt:0'],
            'square_meter' => ['required', 'numeric', 'gt:0'],
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg|dimensions:min_width=300,min_height=300|max:5012',
            'parent_image' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg|dimensions:min_width=300,min_height=300|max:5012',
            'duplex' => 'bool'
        ];
    }
}
