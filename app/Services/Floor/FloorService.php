<?php

namespace App\Services\Floor;

use App\Models\Apartment;
use App\Models\Floor;
use App\Services\Floor\Data\FloorTypeEnum;
use Illuminate\Support\Collection;

class FloorService
{
    public function __construct(
        private FloorRepository $repository
    )
    {
    }

    public function getByBuildingId(int $buildingId, ?FloorTypeEnum $type = null): Collection
    {
        return $this->repository->getByBuildingId($buildingId, $type);
    }

    public function updatePrice(int $buildingId, int $floorId, float $price)
    {
        $this->repository->getById($floorId);
        Floor::query()->where('id', $floorId)->update([
            'price' => $price
        ]);
        Apartment::query()->where('floor_id', $floorId)->update([
            'active_price' => $price
        ]);
    }
}
