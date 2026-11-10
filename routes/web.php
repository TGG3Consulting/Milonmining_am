<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Client\BuildingController;
use App\Http\Controllers\Client\ApartmentController;
use App\Http\Controllers\Client\HouseController;
use App\Http\Controllers\Client\RequestController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as VerifyCsrf;
Route::group(['prefix' => 'apartments'], function () {
    Route::get('/', [ApartmentController::class, 'list']);
    Route::get('/featured', [ApartmentController::class, 'featured']);
});
Route::group(['prefix' => 'buildings'], function () {
    Route::get('/', [BuildingController::class, 'list']);
});
Route::group(['prefix' => 'reserve'], function () {
    Route::post('/{type}', [RequestController::class, 'store'])->withoutMiddleware([VerifyCsrf::class]);
    Route::post('/{request_id}/want_garage', [RequestController::class, 'want_garage'])->withoutMiddleware([VerifyCsrf::class]);
})->middleware('throttle:reserve');

// The feedback form. It sits outside the reserve group on purpose: that group's
// {type} is a wildcard, so a /reserve/contact would be read as a block name.
// It carries no apartment and becomes a Lead in Bitrix rather than a Deal.
Route::post('/contact', [RequestController::class, 'contact'])
    ->withoutMiddleware([VerifyCsrf::class])
    ->middleware('throttle:reserve');

Route::group(['prefix' => 'houses'], function () {
    Route::get('/', [HouseController::class, 'list']);
    Route::get('/townhouses/slides', [HouseController::class, 'townhouseSlides']);
});
Route::get('/csrf-cookie', function () {
    // ensure a session exists
    session()->put('_csrf_boot', true);

    return response()->noContent()->withCookie(
        cookie(
            'XSRF-TOKEN',          // must match axios xsrfCookieName
            csrf_token(),          // plain session CSRF token
            120,                   // minutes
            '/',
            null,
            false,                 // secure=false for http://localhost
            false,                 // httpOnly=false so JS can read if needed
            false,
            'Lax'
        )
    );
});
