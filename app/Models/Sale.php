<?php

namespace App\Models;

use App\Services\Sale\Enum\SaleStatusEnum;
use App\Services\Sale\Enum\SaleTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $casts = [
        'status' => SaleStatusEnum::class,
        'type' => SaleTypeEnum::class
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class);
    }

    public function building_garage(): BelongsTo
    {
        return $this->belongsTo(BuildingGarage::class);
    }
}
