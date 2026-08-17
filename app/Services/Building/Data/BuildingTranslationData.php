<?php

namespace App\Services\Building\Data;

use App\Enum\LocaleEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class BuildingTranslationData extends Data
{
    public function __construct(
        public LocaleEnum $locale,
        public int $key_id,
        public string $value
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'locale' => ['required', new Enum(LocaleEnum::class)],
            'key_id' => ['required', 'integer', 'gt:0'],
            'value' => ['required', 'string']
        ];
    }
}
