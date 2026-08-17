<?php

namespace App\Services\Apartment\Enum;

enum ApartmentStatusEnum: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case RESERVED = 'reserved';
    case SOLD = 'sold';
}
