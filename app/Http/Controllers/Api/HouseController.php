<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\House\Data\HouseInsertData;
use App\Services\House\Data\HouseListData;
use App\Services\House\Data\HouseUpdateData;
use App\Services\House\HouseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HouseController extends Controller
{
    public function __construct(
        private HouseService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list(HouseListData::from($request)));
    }

    public function getById(int $id): JsonResponse
    {
        return $this->success($this->service->showById($id));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = HouseInsertData::from($request);
        try {
            $this->service->store($dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $dto = HouseUpdateData::from($request);
        try {
            $this->service->update($id, $dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
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
}
