<?php

namespace App\Http\Controllers\Client;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use App\Services\Client\Building\BuildingService;
use App\Services\Client\Request\Data\RequestInsertData;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Client\Request\RequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RequestController extends Controller
{
    public function __construct(
        private RequestService  $service,
        private BuildingService $buildingService
    )
    {
    }

    public function store(string $block, Request $request): JsonResponse
    {
        $dto = RequestInsertData::from($request);
        $block = RequestBlockEnum::from($block);
        $request = $this->service->store($block, $dto, LocaleEnum::from($request->get('lang') === 'hy' ? 'am' : $request->get('lang')));
        if ($block === RequestBlockEnum::APARTMENTS) {
            return $this->created([
                'garage_availability' => $this->buildingService->getGaragesAvailability($dto->relation_id),
                'request_id' => $request->id,
                'session' => $request->hash
            ]);
        }
        return $this->created([
            'garage_availability' => false
        ]);
    }

    public function want_garage(Request $request, int $requestId): JsonResponse
    {
        $this->service->want_garage($requestId, $request->get('session'));
        return $this->success();
    }
}
