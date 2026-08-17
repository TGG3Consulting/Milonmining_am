<?php

namespace App\Services\Discount;

use App\Models\Apartment;
use App\Models\BuildingGarage;
use App\Models\House;
use App\Services\Apartment\Data\ApartmentInsertData;
use App\Services\Apartment\Data\ApartmentListData;
use App\Services\Apartment\ApartmentRepository;
use App\Services\Discount\Data\DiscountInsertData;
use App\Services\Discount\Data\DiscountUpsertByProduct;
use App\Services\Discount\Enum\DiscountBlockEnum;
use App\Services\Discount\Enum\DiscountStatusEnum;
use App\Services\Garage\Data\GarageListData;
use App\Services\Garage\GarageRepository;
use App\Services\House\Data\HouseListData;
use App\Services\House\HouseRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DiscountService
{
    public function __construct(
        private DiscountRepository  $discountRepository,
        private ApartmentRepository $apartmentRepository,
        private HouseRepository     $houseRepository,
        private GarageRepository    $garageRepository,
    )
    {
    }

    public function list(DiscountBlockEnum $block): Collection
    {
        return $this->discountRepository->list($block);
    }

    public function store(DiscountInsertData $dto): void
    {
        DB::transaction(function () use ($dto) {
            if ($this->discountRepository->checkExist($dto)) {
                throw new \InvalidArgumentException('Նման ֆիլտրով զեղչային համակարգ արդեն իսկ գոյություն ունի');
            }
            $this->updateRelationDiscounts($dto->block, $dto->filter, $dto->value);
            $this->discountRepository->store($dto);
        });
    }

    public function updateByProduct(DiscountUpsertByProduct $dto): void
    {
        if ($dto->block === DiscountBlockEnum::APARTMENTS) {
            $apartment = $this->apartmentRepository->getById($dto->product_id);
            $apartment->discount = $dto->discount;
            $apartment->save();
        } else if ($dto->block === DiscountBlockEnum::HOUSES) {
            $house = $this->houseRepository->getById($dto->product_id);
            $house->discount = $dto->discount;
            $house->save();
        } else if ($dto->block === DiscountBlockEnum::GARAGES) {
            $garage = $this->garageRepository->getById($dto->product_id);
            $garage->discount = $dto->discount;
            $garage->save();
        }
    }

    public function archive(int $id): void
    {
        DB::transaction(function () use ($id) {
            $discount = $this->discountRepository->getById($id);
            $this->updateRelationDiscounts($discount->block, $discount->filter, 0);
            $discount->status = DiscountStatusEnum::ARCHIVED;
            $discount->save();
        });
    }

    private function updateRelationDiscounts(DiscountBlockEnum $block, array $filter, int $value)
    {
        if ($block === DiscountBlockEnum::APARTMENTS) {
            $filterDTO = ApartmentListData::from($filter);
            $filterDTO->limit = 20000000;
            Apartment::query()
                ->whereIn('id', $this->apartmentRepository->list($filterDTO)->pluck('id'))
                ->update([
                    'discount' => $value
                ]);
        } else if ($block === DiscountBlockEnum::HOUSES) {
            $filterDTO = HouseListData::from($filter);
            House::query()
                ->whereIn('id', $this->houseRepository->list($filterDTO)->pluck('id'))
                ->update([
                    'discount' => $value
                ]);
        } else if ($block === DiscountBlockEnum::GARAGES) {
            $filterDTO = GarageListData::from($filter);
            $filterDTO->limit = 20000000;
            BuildingGarage::query()
                ->whereIn('id', $this->garageRepository->list($filterDTO)->pluck('id'))
                ->update([
                    'discount' => $value
                ]);
        }
    }
}
