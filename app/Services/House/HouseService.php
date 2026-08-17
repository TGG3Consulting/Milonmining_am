<?php

namespace App\Services\House;

use App\Services\House\Data\HouseInsertData;
use App\Services\House\Data\HouseListData;
use App\Services\House\Data\HouseUpdateData;
use App\Services\House\Enum\HouseStatusEnum;
use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Support\Collection;

class HouseService
{
    public function __construct(
        private HouseRepository $repository,
    )
    {
    }

    public function list(HouseListData $dto): Collection
    {
        return $this->repository->list($dto);
    }

    public function showById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function store(HouseInsertData $dto): void
    {
        $this->repository->store($dto);
    }

    public function update(int $id, HouseUpdateData $dto): void
    {
        $this->repository->update($this->repository->getById($id), $dto);
    }

    public function switcher(int $id, bool $active): HouseStatusEnum
    {
        $house = $this->repository->getById($id);
        if(!$active) {
            $house->old_status = $house->status;
            $house->status = HouseStatusEnum::PENDING;
        } else {
            if($house->status === HouseStatusEnum::PENDING) {
                if(!$house->old_status) {
                    $house->status = HouseStatusEnum::ACTIVE;
                } else {
                    $house->status = $house->old_status;
                }
            }
        }
        if($house->isDirty()) {
            $house->save();
        }
        return $house->status;
    }

    public function cancelReserve(int $id): void
    {
        $house = $this->repository->getById($id);
        if($house->status !== HouseStatusEnum::RESERVED) {
            throw new \InvalidArgumentException('Տվյալ բնակարանը ռեզերվ չէ');
        }
        $sale = $house->sale()->first();
        if($sale) {
            $sale->status = SaleStatusEnum::CANCELED;
            $sale->save();
        }
        $house->status = HouseStatusEnum::ACTIVE;
        $house->save();
    }
}
