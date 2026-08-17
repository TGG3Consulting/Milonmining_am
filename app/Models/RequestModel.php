<?php

namespace App\Models;

use App\Enum\LocaleEnum;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Client\Request\Enum\RequestTypeEnum;
use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RequestModel extends Model
{
    protected $table = 'requests';

    protected $casts = [
        'block' => RequestBlockEnum::class,
        'type' => RequestTypeEnum::class,
        'locale' => LocaleEnum::class,
    ];

    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class, 'relation_id', 'id');
    }

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class, 'relation_id', 'id');
    }

    public function building_garage(): BelongsTo
    {
        return $this->belongsTo(BuildingGarage::class, 'building_garage_id', 'id');
    }

    public function sale_reserve(): HasOne
    {
        return $this->hasOne(Sale::class, 'request_id')
            ->where('sales.status', SaleStatusEnum::RESERVE);
    }
}
