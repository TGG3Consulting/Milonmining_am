<?php

namespace App\Services\Client\Request\Enum;

enum RequestTypeEnum: string
{
    case RESERVE = 'reserve';
    case CALLBACK = 'callback';
}
