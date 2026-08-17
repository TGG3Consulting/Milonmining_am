<?php

namespace App\Http\Controllers\Client;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use App\Services\Client\Apartment\ApartmentService;
use App\Services\Client\Apartment\Data\ApartmentListData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApartmentController extends Controller
{
    public function __construct(
        private ApartmentService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list(ApartmentListData::from($request)));
    }

    public function featured(): JsonResponse
    {
        return $this->success($this->service->featured());
    }
}
