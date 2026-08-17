<?php

namespace App\Services\Garage\Enum;

enum GarageStatusEnum: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case RESERVED = 'reserved';
    case SOLD = 'sold';
}
