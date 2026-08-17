<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Floor\Data\FloorTypeEnum;
use App\Services\Floor\FloorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function __construct(
        private FloorService $service
    )
    {
    }

    public function getByBuildingId(Request $request, int $buildingId): JsonResponse
    {
        return $this->success($this->service->getByBuildingId($buildingId, $request->get('type') ? FloorTypeEnum::from($request->get('type')) : null));
    }

    public function updatePrice(int $buildingId, int $floorId, Request $request)
    {
        $this->service->updatePrice($buildingId, $floorId, $request->get('price') ?? 0);
        return $this->success();
    }
}
