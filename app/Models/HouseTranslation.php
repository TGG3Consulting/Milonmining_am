<?php

namespace App\Models;

use App\Enum\LocaleEnum;
use Illuminate\Database\Eloquent\Model;

class HouseTranslation extends Model
{
    protected $casts = [
        'locale' => LocaleEnum::class,
    ];
}
