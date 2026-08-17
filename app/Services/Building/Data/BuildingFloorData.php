<?php

namespace App\Services\Building\Data;

use App\Services\Floor\Data\FloorTypeEnum;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class BuildingFloorData extends Data
{
    public function __construct(
        public int $level,
        public FloorTypeEnum $type,
        public float $price,
        public ?UploadedFile $model_image = null,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'type' => ['required', new Enum(FloorTypeEnum::class)],
            'price' => ['required', 'numeric', 'gte:0'],
            'level' => ['required', 'integer'],
            'model_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif',
        ];
    }
}
