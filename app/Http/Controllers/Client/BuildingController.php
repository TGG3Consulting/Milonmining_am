<?php

namespace App\Http\Controllers\Client;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use App\Services\Client\Building\BuildingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function __construct(
        private BuildingService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list(LocaleEnum::from($request->get('lang') === 'hy' ? 'am' : $request->get('lang'))));
    }
}
