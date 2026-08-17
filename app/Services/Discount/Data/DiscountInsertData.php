<?php

namespace App\Services\Discount\Data;

use App\Services\Discount\Enum\DiscountBlockEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class DiscountInsertData extends Data
{
    public function __construct(
        public DiscountBlockEnum $block,
        public array             $filter,
        public float             $value
    )
    {
    }

    public static function rules(): array
    {
        return [
            'block' => ['required', new Enum(DiscountBlockEnum::class)],
            'filter' => 'required|array',
            'value' => 'required|numeric|gt:0',
        ];
    }
}
