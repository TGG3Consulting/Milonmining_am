<?php

namespace App\Services\House\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

final class HouseFloorData extends Data
{
    public function __construct(
        public float $square_meter,
        public ?UploadedFile $model_image = null,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'square_meter' => ['required', 'numeric', 'gte:0'],
            'model_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|dimensions:min_width=300,min_height=300|max:5012',
        ];
    }
}
