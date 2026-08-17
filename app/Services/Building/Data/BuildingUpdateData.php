<?php

namespace App\Services\Building\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

final class BuildingUpdateData extends Data
{
    public function __construct(
        public string $start_date,
        public string $end_date,
        /** @var array<BuildingTranslationData> */
        public array $translations,
        /** @var string[] */
        public array $blocks,
        /** @var array<BuildingFloorData> */
        public array $floors
    )
    {
    }

    public static function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'translations' => ['required', 'array'],
            'blocks' => ['required', 'array'],
            'floors' => ['required', 'array'],
        ];
    }
}
