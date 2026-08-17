<?php

namespace App\Services\Sale\Enum;

enum SaleTypeEnum: string
{
    case SALE = 'sale';
    case MORTGAGE = 'mortgage';
    case REPAYMENT = 'repayment';
}
