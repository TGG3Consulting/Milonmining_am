<?php

namespace App\Models;

use App\Services\Discount\Enum\DiscountBlockEnum;
use App\Services\Discount\Enum\DiscountStatusEnum;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $casts = [
        'filter' => 'array',
        'block' => DiscountBlockEnum::class,
        'status' => DiscountStatusEnum::class,
    ];
}
