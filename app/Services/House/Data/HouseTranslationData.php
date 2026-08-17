<?php

namespace App\Services\House\Data;

use App\Enum\LocaleEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class HouseTranslationData extends Data
{
    public function __construct(
        public LocaleEnum $locale,
        public string $key,
        public string $value,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'locale' => ['required', new Enum(LocaleEnum::class)],
            'key' => ['required', 'string'],
            'value' => ['required', 'string'],
        ];
    }
}
