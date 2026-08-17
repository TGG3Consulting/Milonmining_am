<?php

namespace App\Services\Sale\Enum;

enum SaleStatusEnum: string
{
    case SALE = 'sale';
    case RESERVE = 'reserve';
    case CANCELED = 'canceled';
}
