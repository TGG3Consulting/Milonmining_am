<?php

namespace App\Http\Controllers\Client;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use App\Services\Client\House\Data\HouseListData;
use App\Services\Client\House\HouseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function __construct(
        private HouseService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list(HouseListData::from($request), $this->resolveLocale($request)));
    }

    public function townhouseSlides(): JsonResponse
    {
        return $this->success($this->service->townhouseSlides());
    }
}
