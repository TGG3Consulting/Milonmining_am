<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'permission'         => PermissionMiddleware::class,
            'role'               => RoleMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class
        ]);
        // use() replaces the whole global stack, and Laravel's own default
        // stack starts with InvokeDeferredCallbacks. Dropping it means every
        // defer() closure is collected and then silently thrown away, which is
        // what swallowed the Bitrix push after a booking: HTTP 201, no CRM
        // record, nothing in the log.
        $middleware->use([
            \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
//        $middleware->appendToGroup('web', \App\Http\Middleware\VerifyCsrfToken::class);
        $middleware->appendToGroup('web', \App\Http\Middleware\EnsureDeviceCookie::class);
        $middleware->appendToGroup('api', EnsureFrontendRequestsAreStateful::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
