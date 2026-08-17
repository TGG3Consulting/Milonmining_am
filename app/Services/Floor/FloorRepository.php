<?php

namespace App\Services\Floor;

use App\Models\Floor;
use App\Services\Floor\Data\FloorTypeEnum;
use Illuminate\Support\Collection;

class FloorRepository
{
    public function getByBuildingId(int $buildingId, ?FloorTypeEnum $type = null): Collection
    {
        return Floor::query()
            ->when($type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->where('building_id', $buildingId)->get();
    }

    public function getById(int $id): Floor
    {
        return Floor::query()->findOrFail($id);
    }
}
