<?php

namespace App\Services\Sale\Data;

use App\Services\Sale\Enum\SaleStatusEnum;
use App\Services\Sale\Enum\SaleTypeEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class SaleUpdateData extends Data
{
    public function __construct(
        public ?SaleTypeEnum $type,
        public ?float        $price,
        public ?int         $building_garage_id,
        public ?float        $garage_price,
        public ?float       $deposit,
        public ?float       $repayment_months_quantity,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'type' => ['required_if:status,sale','nullable', new Enum(SaleTypeEnum::class)],
            'building_garage_id' => ['nullable', 'integer', 'gt:0'],
            'price' => ['required_if:status,sale','nullable', 'numeric','gt:0'],
            'garage_price' => ['nullable', 'numeric','gt:0'],
            'deposit' => ['nullable', 'numeric','gte:0'],
            'repayment_months_quantity' => ['nullable', 'integer','gt:0'],
        ];
    }
}
