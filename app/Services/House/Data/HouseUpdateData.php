<?php

namespace App\Services\House\Data;

use App\Services\House\Enum\HouseStatusEnum;
use App\Services\House\Enum\HouseTypeEnum;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

final class HouseUpdateData extends Data
{
    public function __construct(
        public HouseTypeEnum $type,
        public float         $price,
        /** @var array<HouseTranslationData> */
        public array         $translations,
        /** @var array<HouseFloorData> */
        public array         $floors,
        public int           $design_id,
        public float           $terrace_size,
        public float           $plot_size,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'type' => 'required|string',
            'price' => 'required|numeric|gte:0',
            'translations' => 'required|array',
            'floors' => 'required|array',
            'images' => 'required_if:design_id,null|array',
            'images.*' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'design_id' => 'nullable|integer|gt:0',
            'terrace_size' => 'nullable|numeric|gte:0',
            'plot_size' => 'nullable|numeric|gte:0',
        ];
    }
}
