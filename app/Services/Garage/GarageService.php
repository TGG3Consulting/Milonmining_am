<?php

namespace App\Services\Garage;

use App\Services\Floor\FloorRepository;
use App\Services\Garage\Data\GarageListData;
use App\Services\Garage\Data\GarageUpsertData;
use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Support\Collection;

class GarageService
{
    public function __construct(
        private GarageRepository $repository,
        private FloorRepository  $floorRepository
    )
    {
    }

    public function list(GarageListData $dto): Collection
    {
        return $this->repository->list($dto);
    }

    public function showById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function store(GarageUpsertData $dto): void
    {
        $this->repository->store($this->floorRepository->getById($dto->floor_id), $dto);
    }

    public function update(int $id, GarageUpsertData $dto): void
    {
        $garage = $this->repository->getById($id);
//        if ($garage->status !== GarageStatusEnum::PENDING) {
//            throw new \InvalidArgumentException('garage needs to be in pending mode');
//        }
        $this->repository->update(
            $this->repository->getById($id),
            $this->floorRepository->getById($dto->floor_id),
            $dto
        );
    }

    public function switcher(int $id, bool $active): GarageStatusEnum
    {
        $garage = $this->repository->getById($id);
        if (!$active) {
            if($garage->status !== GarageStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Բնակարանը արդեն վաճառված է կամ ռեզերվավորված');
            }
            $garage->old_status = $garage->status;
            $garage->status = GarageStatusEnum::PENDING;
        } else {
            if ($garage->status === GarageStatusEnum::PENDING) {
                if (!$garage->old_status) {
                    $garage->status = GarageStatusEnum::ACTIVE;
                } else {
                    $garage->status = $garage->old_status;
                }
            }
        }
        if ($garage->isDirty()) {
            $garage->save();
        }
        return $garage->status;
    }
}
