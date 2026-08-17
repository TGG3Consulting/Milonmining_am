<?php

namespace App\Services\Discount\Enum;

enum DiscountStatusEnum: string
{
    case ACTIVE = 'active';
    case ARCHIVED = 'archived';
}
