<?php

namespace App\Services\Sale\Data;

use App\Models\Apartment;
use App\Models\BuildingGarage;
use App\Services\Sale\Enum\SaleStatusEnum;
use App\Services\Sale\Enum\SaleTypeEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class SaleApartmentInsertData extends Data
{
    private ?int $resident_id = null;
    private ?BuildingGarage $garage;
    private ?Apartment $apartment;
    public function __construct(
        public ?SaleTypeEnum $type,
        public SaleStatusEnum $status,
        public ?string       $name,
        public ?string       $phone_number,
        public int          $apartment_id,
        public ?int          $request_id,
        public ?int         $building_garage_id,
        public ?float       $deposit,
        public ?float       $repayment_months_quantity,
        public ?string $sale_date,
        public ?float $price = 0,
        public ?float $garage_price = 0,
    )
    {
    }

    public function getGarage(): ?BuildingGarage
    {
        return $this->garage;
    }

    public function setGarage(?BuildingGarage $garage): void
    {
        $this->garage = $garage;
    }

    public function getApartment(): ?Apartment
    {
        return $this->apartment;
    }

    public function setApartment(?Apartment $apartment): void
    {
        $this->apartment = $apartment;
    }

    public function getResidentId(): ?int
    {
        return $this->resident_id;
    }

    public function setResidentId(int $resident_id): void
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
            'type' => ['required_if:status,sale','nullable', new Enum(SaleTypeEnum::class)],
            'status' => ['required', new Enum(SaleStatusEnum::class)],
            'name' => ['nullable', 'string', 'min:3'],
            'phone_number' => [
                'nullable',
                'regex:/^(\+374\d{8}|\+7\d{10})$/'
            ],
            'request_id' => ['nullable', 'integer', 'gt:0'],
            'apartment_id' => ['required', 'integer', 'gt:0'],
            'building_garage_id' => ['nullable', 'integer', 'gt:0'],
//            'deposit' => ['nullable', 'numeric','gte:0'],
//            'repayment_months_quantity' => ['nullable', 'integer','gt:0'],
            'sale_date' => ['nullable', 'date']
        ];
    }
}
