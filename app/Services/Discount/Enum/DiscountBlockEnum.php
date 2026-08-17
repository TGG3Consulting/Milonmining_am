<?php

namespace App\Services\Discount\Enum;

enum DiscountBlockEnum: string
{
    case APARTMENTS = 'apartments';
    case HOUSES = 'houses';
    case GARAGES = 'garages';
}
