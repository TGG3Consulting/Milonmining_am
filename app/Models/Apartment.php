<?php

namespace App\Models;

use App\Services\Apartment\Enum\ApartmentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Apartment extends Model
{
    protected $casts = [
        'status' => ApartmentStatusEnum::class,
    ];

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function sale(): HasOne
    {
        return $this->hasOne(Sale::class, 'apartment_id');
    }
}
