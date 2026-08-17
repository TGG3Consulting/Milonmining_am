<?php

namespace App\Models;

use App\Services\Floor\Data\FloorTypeEnum;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    protected $fillable = [
        'building_id',
        'type',
        'level',
        'price',
        'model_image',
        'label'
    ];

    protected $casts = [
        'type' => FloorTypeEnum::class,
    ];
}
