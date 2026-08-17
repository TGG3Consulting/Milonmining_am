<?php

namespace App\Services\Block;

use Illuminate\Support\Collection;

class BlockService
{
    public function __construct(
        private BlockRepository $repository
    )
    {
    }

    public function getByBuildingId(int $buildingId): Collection
    {
        return $this->repository->getByBuildingId($buildingId);
    }
}
