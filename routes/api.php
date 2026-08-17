<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\TranslationController;
use App\Http\Controllers\Api\LocaleController;
use App\Http\Controllers\Api\ApartmentController;
use App\Http\Controllers\Api\BlockController;
use App\Http\Controllers\Api\FloorController;
use App\Http\Controllers\Api\DesignController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\GarageController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\DiscountController;
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/pbx/calls', function (\Illuminate\Http\Request $r, \App\Services\CallCenter\CallCenterService $pbx) {
        // Accept either ISO (from the Vue) or already-basic strings
        $from = $r->query('from');
        $to   = $r->query('to');

        // Defaults: today 00:00 → now, UTC
        $start = $from ? \Carbon\Carbon::parse($from) : now()->startOfDay();
        $end   = $to   ? \Carbon\Carbon::parse($to)   : now();

        // PBX format: 20250928T000000Z
        $fmt = fn(\Carbon\Carbon $dt) => $dt->copy()->utc()->format('Ymd\THis\Z');

        $params = [
            'start' => $fmt($start),
            'end'   => $fmt($end),
            'page'  => (int) $r->query('page', 1),
            'per'   => (int) $r->query('per', 50),
            // pass through extra filters if PBX supports them
        ];

        return $pbx->listCalls($params);
    });

    Route::post('/pbx/make-call', function (\Illuminate\Http\Request $r, \App\Services\CallCenter\CallCenterService $pbx) {
        $data = $r->validate([
            'from_ext' => 'required|string|max:32',
            'to'       => 'required|string|max:64',
            'name'     => 'nullable|string|max:100',
        ]);
        return $pbx->makeCall($data['from_ext'], $data['to'], $data['name'] ?? null);
    });


    Route::get('/pbx/accounts', function (\App\Services\CallCenter\CallCenterService $pbx) {
        $data = $pbx->listAccounts(); // {"items":[...], "info":{...}}

        $items = $data['items'] ?? [];
        // Map to a simple shape for the Vue page
        $accounts = array_map(function ($u) {
            return [
                'login'     => $u['login'] ?? null,
                'name'      => $u['name'] ?? ($u['login'] ?? 'User'),
                'position'  => $u['position'] ?? null,
                'email'     => $u['email'] ?? null,
                'extension' => $u['ext'] ?? null,
                'role'      => $u['role'] ?? null,
            ];
        }, $items);

        return ['accounts' => $accounts, 'total' => $data['info']['total'] ?? count($accounts)];
    });


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    Route::get('/account/me', [UserController::class, 'me']);
    Route::group(['prefix' => 'pages'], function () {

        Route::get('/tree', [PageController::class, 'tree']);

        Route::middleware('permission:pages.manage')->group(function () {
            Route::get('/', [PageController::class, 'index']);
            Route::post('/', [PageController::class, 'store']);
            Route::patch('/{id}', [PageController::class, 'update']);
            Route::delete('/{id}', [PageController::class, 'destroy']);
            Route::post('/reorder', [PageController::class, 'reorder']);
        });
    });

    Route::group(['prefix' => 'roles'], function () {

        Route::middleware('permission:roles.manage')->group(function () {
            Route::get('/', [RoleController::class, 'list']);
        });

        Route::middleware('permission:roles.manage')->group(function () {
            Route::post('/', [RoleController::class, 'store']);
            Route::patch('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
        });

        Route::group(['prefix' => '{id}/permissions'], function () {

            Route::middleware('permission:roles.view')->group(function () {
                Route::get('/', [RolePermissionController::class, 'list']);
            });

            Route::middleware('permission:roles.manage')->group(function () {
                Route::post('/attach', [RolePermissionController::class, 'attach']);
                Route::post('/detach', [RolePermissionController::class, 'detach']);
            });

        });
        Route::middleware('permission:roles.manage')->group(function () {
            Route::post('/sync-permissions', [RolePermissionController::class, 'syncPermissions']);
        });

    });

    Route::group(['prefix' => 'permissions'], function () {

        Route::middleware('permission:roles.manage')->group(function () {
            Route::get('/', [PermissionController::class, 'list']);
        });

    });

    Route::group(['prefix' => 'users'], function () {

        Route::middleware('permission:users.view')->group(function () {
            Route::get('/', [UserController::class, 'list']);
        });
        Route::middleware('permission:users.manage')->group(function () {
            Route::post('', [UserController::class, 'store']);
            Route::patch('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
        });

    });

    Route::group(['prefix' => 'locales'], function () {
        Route::get('/', [LocaleController::class, 'list']);

    });
    Route::group(['prefix' => 'translations'], function () {
        Route::get('/keys/{table}', [TranslationController::class, 'getKeys']);

    });
    Route::group(['prefix' => 'buildings'], function () {
        Route::middleware('permission:buildings.view')->group(function () {
            Route::get('/', [BuildingController::class, 'list']);
            Route::get('/{id}', [BuildingController::class, 'showById']);
        });
        Route::middleware('permission:buildings.manage')->group(function () {
            Route::post('/', [BuildingController::class, 'store']);
            Route::post('/{id}', [BuildingController::class, 'update']);
            Route::patch('/{id}/switcher', [BuildingController::class, 'switcher']);
            Route::delete('/{id}/images/{image_id}', [BuildingController::class, 'deleteImage']);
            Route::patch('/{id}/images/{image_id}', [BuildingController::class, 'changeMainImage']);
            Route::post('/{id}/image', [BuildingController::class, 'uploadImage']);
        });
        Route::group(['prefix' => '{building_id}/blocks'], function () {
            Route::get('/', [BlockController::class, 'getByBuildingId']);
        });
        Route::group(['prefix' => '{building_id}/floors'], function () {
            Route::get('/', [FloorController::class, 'getByBuildingId']);
            Route::put('{floor_id}/price', [FloorController::class, 'updatePrice']);
        });
    });


    Route::group(['prefix' => 'apartments'], function () {
        Route::middleware('permission:apartments.view')->group(function () {
            Route::get('/', [ApartmentController::class, 'list']);
            Route::get('/{id}', [ApartmentController::class, 'showById']);
        });
        Route::middleware('permission:apartments.manage')->group(function () {
            Route::post('/', [ApartmentController::class, 'store']);
            Route::post('/{id}', [ApartmentController::class, 'update']);
            Route::patch('/{id}/main', [ApartmentController::class, 'forMain']);
            Route::patch('/{id}/switcher', [ApartmentController::class, 'switcher']);
            Route::patch('/{id}/cancelReserve', [ApartmentController::class, 'cancelReserve']);

        });
    });
    Route::group(['prefix' => 'garages'], function () {
        Route::middleware('permission:garages.view')->group(function () {
            Route::get('/', [GarageController::class, 'list']);
            Route::get('/{id}', [GarageController::class, 'showById']);
        });
        Route::middleware('permission:garages.manage')->group(function () {
            Route::post('/', [GarageController::class, 'store']);
            Route::post('/{id}', [GarageController::class, 'update']);
            Route::patch('/{id}/switcher', [GarageController::class, 'switcher']);
        });
    });
    Route::group(['prefix' => 'designs'], function () {
        Route::get('/', [DesignController::class, 'list']);
        Route::get('/{id}', [DesignController::class, 'getById']);

        Route::middleware('permission:designs.manage')->group(function () {
            Route::post('/', [DesignController::class, 'store']);
            Route::post('/{id}', [DesignController::class, 'update']);
            Route::delete('/{id}/images/{image_id}', [DesignController::class, 'deleteImage']);
            Route::post('/{id}/image', [DesignController::class, 'uploadImage']);
        });
    });
    Route::group(['prefix' => 'houses'], function () {
        Route::get('/', [HouseController::class, 'list']);
        Route::get('/{id}', [HouseController::class, 'getById']);

        Route::middleware('permission:houses.manage')->group(function () {
            Route::post('/', [HouseController::class, 'store']);
            Route::post('/{id}', [HouseController::class, 'update']);
            Route::patch('/{id}/switcher', [HouseController::class, 'switcher']);
            Route::patch('/{id}/cancelReserve', [HouseController::class, 'cancelReserve']);
        });
    });
    Route::group(['prefix' => 'requests'], function () {
        Route::get('/', [RequestController::class, 'list']);
        Route::get('/{id}', [RequestController::class, 'showById']);
        Route::middleware('permission:requests.manage')->group(function () {
            Route::post('/', [RequestController::class, 'store']);
            Route::post('/{id}', [RequestController::class, 'update']);
        });
    });
    Route::group(['prefix' => 'sales'], function () {
        Route::get('/apartments', [SaleController::class, 'apartmentList']);
        Route::get('/houses', [SaleController::class, 'houseList']);

        Route::middleware('permission:sales.manage')->group(function () {
            Route::post('/{block}', [SaleController::class, 'store']);
            Route::patch('/{id}', [SaleController::class, 'update']);
            Route::put('/{id}', [SaleController::class, 'sale']);
            Route::delete('/{id}', [SaleController::class, 'cancel']);
        });
    });
    Route::group(['prefix' => 'discounts'], function () {
        Route::get('/{block}', [DiscountController::class, 'list']);
        Route::middleware('permission:discounts.manage')->group(function () {
            Route::post('/', [DiscountController::class, 'store']);
            Route::post('/product', [DiscountController::class, 'updateByProduct']);
            Route::delete('/{id}', [DiscountController::class, 'archive']);
        });
    });
});
