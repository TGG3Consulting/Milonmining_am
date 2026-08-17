<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureDeviceCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->hasCookie('device_id')) {
            $deviceId = (string) Str::uuid();

            // 5 years (minutes)
            $minutes = 60 * 24 * 365 * 5;

            // SameSite: Lax is OK for same-site (localhost ports count as same-site).
            // If your API is on a different domain in prod, switch to 'None' + secure=true.
            Cookie::queue(cookie(
                name: 'device_id',
                value: $deviceId,
                minutes: $minutes,
                path: '/',
                domain: null, // set your apex/domain in prod if needed, e.g. '.example.com'
                secure: app()->environment('production'),
                httpOnly: true,
                raw: false,
                sameSite: 'Lax' // or 'None' (must be Secure=true) if truly cross-site in prod
            ));
        }

        return $response;
    }
}
