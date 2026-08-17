<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Apartment\ApartmentService;
use App\Services\Apartment\Data\ApartmentInsertData;
use App\Services\Apartment\Data\ApartmentListData;
use App\Services\Apartment\Data\ApartmentUpdateData;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApartmentController extends Controller
{
    public function __construct(
        private ApartmentService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        $dto = ApartmentListData::from($request);
        return $this->success($this->service->list($dto));
    }

    public function showById(int $id): JsonResponse
    {
        return $this->success($this->service->showById($id));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = ApartmentInsertData::from($request);
        try {
            $this->service->store($dto);
            return $this->created();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (UniqueConstraintViolationException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 && $exception->getCode() < 500? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $dto = ApartmentUpdateData::from($request);
        try {
            $this->service->update($id, $dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function switcher(int $id, Request $request): JsonResponse
    {
        return $this->success($this->service->switcher($id, $request->get('active') ?? false));
    }

    public function cancelReserve(int $id): JsonResponse
    {
        try {
            $this->service->cancelReserve($id);
            return $this->noContent();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function forMain(int $id, Request $request): JsonResponse
    {
        try {
            return $this->success($this->service->forMain($id, $request->get('for_main') ?? false));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }
}
