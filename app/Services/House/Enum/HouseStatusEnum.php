<?php

namespace App\Services\House\Enum;

enum HouseStatusEnum: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case RESERVED = 'reserved';
    case SOLD = 'sold';
}
