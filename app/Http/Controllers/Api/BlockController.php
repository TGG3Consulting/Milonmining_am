<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Block\BlockService;
use Illuminate\Http\JsonResponse;

class BlockController extends Controller
{
    public function __construct(
        private BlockService $service
    )
    {
    }

    public function getByBuildingId(int $buildingId): JsonResponse
    {
        return $this->success($this->service->getByBuildingId($buildingId));
    }
}
