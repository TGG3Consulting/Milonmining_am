<?php

namespace App\Models;

use App\Services\House\Enum\HouseStatusEnum;
use App\Services\House\Enum\HouseTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class House extends Model
{
    protected $casts = [
        'type' => HouseTypeEnum::class,
        'status' => HouseStatusEnum::class,
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(HouseTranslation::class, 'house_id');
    }

    public function floors(): HasMany
    {
        return $this->hasMany(HouseFloor::class, 'house_id');
    }

    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }

    public function sale(): HasOne
    {
        return $this->hasOne(Sale::class, 'house_id');
    }
}
