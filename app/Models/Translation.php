<?php

namespace App\Models;

use App\Enum\LocaleEnum;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $casts = [
        'locale' => LocaleEnum::class
    ];
}
