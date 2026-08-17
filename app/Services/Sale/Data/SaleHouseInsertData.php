<?php

namespace App\Services\Sale\Data;

use App\Models\House;
use App\Services\Sale\Enum\SaleStatusEnum;
use App\Services\Sale\Enum\SaleTypeEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class SaleHouseInsertData extends Data
{
    private ?int $resident_id = null;
    private ?House $house = null;

    public function __construct(
        public ?SaleTypeEnum $type,
        public SaleStatusEnum $status,
        public ?string      $name,
        public ?string      $phone_number,
        public int          $house_id,
        public ?int         $request_id,
        public ?float        $price,
        public ?float       $deposit,
        public ?float       $repayment_months_quantity,
        public ?string $sale_date
    )
    {
    }

    public function getHouse(): ?House
    {
        return $this->house;
    }

    public function setHouse(?House $house): void
    {
        $this->house = $house;
    }

    public function getResidentId(): ?int
    {
        return $this->resident_id;
    }

    public function setResidentId(?int $resident_id): void
    {
        $this->resident_id = $resident_id;
    }

    public function setRequestId(?int $request_id): void
    {
        $this->request_id = $request_id;
    }

    public static function rules(): array
    {
        return [
            'type' => ['nullable', new Enum(SaleTypeEnum::class)],
            'status' => ['required', new Enum(SaleStatusEnum::class)],
            'name' => ['nullable', 'string', 'min:3'],
            'phone_number' => [
                'nullable',
                'regex:/^(\+374\d{8}|\+7\d{10})$/'
            ],
            'request_id' => ['nullable', 'integer', 'gt:0'],
            'house_id' => ['required', 'integer', 'gt:0'],
            'price' => ['nullable', 'numeric', 'gt:0'],
            'deposit' => ['nullable', 'numeric', 'gte:0'],
            'repayment_months_quantity' => ['nullable', 'integer', 'gt:0'],
            'sale_date' => ['nullable', 'date']
        ];
    }
}
