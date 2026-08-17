<?php

namespace App\Services\Building\Enum;

enum BuildingStatusEnum: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
}
