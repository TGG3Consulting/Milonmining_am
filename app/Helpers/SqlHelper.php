<?php

namespace App\Helpers;

use Illuminate\Support\Str;

trait SqlHelper
{
    function mysqlTzString(string|int $timezone): string
    {
        // IANA tz like "Asia/Yerevan" → pass through
        if (is_string($timezone) && Str::contains($timezone, '/')) return $timezone;

        // "+04:00" / "-04:30" → pass through
        if (is_string($timezone) && preg_match('/^[\+\-]\d{1,2}:\d{2}$/', $timezone)) return $timezone;

        // integer hours (e.g., 4 or -4)
        if (is_int($timezone) || (is_string($timezone) && preg_match('/^[\+\-]?\d+$/', $timezone))) {
            $h = (int)$timezone;
            return sprintf('%+03d:00', $h);
        }

        // minutes (e.g., -270 for -04:30)
        if (is_string($timezone) && preg_match('/^[\+\-]?\d+min$/', $timezone)) {
            $m = (int)str_replace('min', '', $timezone);
            $sign = $m >= 0 ? '+' : '-';
            $m = abs($m);
            return sprintf('%s%02d:%02d', $sign, intdiv($m, 60), $m % 60);
        }

        // fallback UTC
        return '+00:00';
    }
}
