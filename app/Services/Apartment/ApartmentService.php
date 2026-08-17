<?php

namespace App\Services\Apartment;

use App\Services\Apartment\Data\ApartmentInsertData;
use App\Services\Apartment\Data\ApartmentListData;
use App\Services\Apartment\Data\ApartmentUpdateData;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Support\Collection;

class ApartmentService
{
    public function __construct(
        private ApartmentRepository $repository,
    )
    {
    }

    public function list(ApartmentListData $dto): Collection
    {
        return $this->repository->list($dto);
    }

    public function store(ApartmentInsertData $dto): void
    {
        $this->repository->store($dto);
    }

    public function update(int $id, ApartmentUpdateData $dto): void
    {
        $apartment = $this->repository->getById($id);
        $this->repository->update($apartment, $dto);
    }

    public function showById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function switcher(int $id, bool $active): ApartmentStatusEnum
    {
        $apartment = $this->repository->getById($id);
        if (!$active) {
            if ($apartment->status !== ApartmentStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Բնակարանը արդեն վաճառված է կամ ռեզերվավորված');
            }
            $apartment->old_status = $apartment->status;
            $apartment->status = ApartmentStatusEnum::PENDING;
        } else {
            if ($apartment->status === ApartmentStatusEnum::PENDING) {
                if (!$apartment->old_status) {
                    $apartment->status = ApartmentStatusEnum::ACTIVE;
                } else {
                    $apartment->status = $apartment->old_status;
                }
            }
        }
        if ($apartment->isDirty()) {
            $apartment->save();
        }
        return $apartment->status;
    }

    public function cancelReserve(int $id): void
    {
        $apartment = $this->repository->getById($id);
        if ($apartment->status !== ApartmentStatusEnum::RESERVED) {
            throw new \InvalidArgumentException('Տվյալ բնակարանը ռեզերվ չէ');
        }
        $sale = $apartment->sale()->first();
        if ($sale) {
            $sale->status = SaleStatusEnum::CANCELED;
            $sale->save();
        }
        $apartment->status = ApartmentStatusEnum::ACTIVE;
        $apartment->save();
    }

    public function forMain(int $id, bool $forMain): bool
    {
        $apartment = $this->repository->getById($id);
        if($apartment->status === ApartmentStatusEnum::PENDING) {
            throw new \InvalidArgumentException('Բնկարանը պետք է ակտիվացնել');
        }
        $apartment->for_main = $forMain;
        $apartment->save();
        return $apartment->for_main;
    }
}
