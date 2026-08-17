<?php

namespace App\Models;

use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BuildingGarage extends Model
{
    protected $casts = [
        'status' => GarageStatusEnum::class,
    ];

    public function sale(): HasOne
    {
        return $this->hasOne(Sale::class, 'garage_id', 'id');
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class, 'building_id', 'id');
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class, 'floor_id', 'id');
    }
}
