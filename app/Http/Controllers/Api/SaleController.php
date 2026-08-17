<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Sale\Data\SaleApartmentInsertData;
use App\Services\Sale\Data\SaleApartmentListData;
use App\Services\Sale\Data\SaleFinalData;
use App\Services\Sale\Data\SaleHouseInsertData;
use App\Services\Sale\Data\SaleHouseListData;
use App\Services\Sale\Data\SaleUpdateData;
use App\Services\Sale\Enum\SaleBlockEnum;
use App\Services\Sale\SaleService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SaleController extends Controller
{
    public function __construct(
        private SaleService $service
    )
    {
    }

    public function apartmentList(Request $request): JsonResponse
    {
        return $this->success($this->service->apartmentList(SaleApartmentListData::from($request)));
    }

    public function houseList(Request $request): JsonResponse
    {
        return $this->success($this->service->houseList(SaleHouseListData::from($request)));
    }

    public function store(string $block, Request $request): JsonResponse
    {
        try {
            $blockEnum = SaleBlockEnum::from($block);
            if ($blockEnum === SaleBlockEnum::APARTMENTS) {
                $dto = SaleApartmentInsertData::from($request);
                $this->service->storeApartment($dto);
            } else {
                $dto = SaleHouseInsertData::from($request);
                $this->service->storeHouse($dto);
            }
            return $this->created();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        }


    }

    public function update(Request $request, int $id): JsonResponse
    {
        $dto = SaleUpdateData::from($request);
        try {
            $this->service->update($id, $dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function sale(int $id, Request $request): JsonResponse
    {
        $dto = SaleFinalData::from($request);
        try {
            $this->service->sale($id, $dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        }
    }

    public function cancel(int $id): JsonResponse
    {
        try {
            $this->service->cancel($id);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        }
    }
}
