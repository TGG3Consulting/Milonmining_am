<?php

namespace App\Services\Discount\Data;

use App\Services\Discount\Enum\DiscountBlockEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class DiscountUpsertByProduct extends Data
{
    public function __construct(
        public DiscountBlockEnum $block,
        public int               $product_id,
        public float             $discount
    )
    {
    }

    public static function rules(): array
    {
        return [
            'block' => ['required', new Enum(DiscountBlockEnum::class)],
            'product_id' => 'required|integer|gt:0',
            'discount' => 'required|numeric|gte:0',
        ];
    }
}
