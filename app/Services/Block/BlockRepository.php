<?php

namespace App\Services\Block;

use App\Models\Block;
use Illuminate\Support\Collection;

class BlockRepository
{
    public function getByBuildingId(int $buildingId): Collection
    {
        return Block::query()->where('building_id', $buildingId)->get();
    }
}
