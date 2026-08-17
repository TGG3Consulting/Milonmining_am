<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('reserve', function (Request $request) {
            $key = 'reserve:' . (
                    $request->user()?->getAuthIdentifier()
                    ?? $request->cookie('device_id')
                    ?? $request->header('X-Device-Id')
                    ?? sha1($request->userAgent() ?? 'na')
                );

            return [
                Limit::perMinute(3)->by($key),
                Limit::perHour(10)->by($key)->response(function () {
                    return response()->json([
                        'ok' => false,
                        'message' => 'Too many attempts. Please try again later.',
                    ], 429);
                }),
            ];
        });
    }
}
