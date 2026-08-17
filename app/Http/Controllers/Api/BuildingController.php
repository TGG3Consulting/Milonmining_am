<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Building\BuildingService;
use App\Services\Building\Data\BuildingInsertData;
use App\Services\Building\Data\BuildingUpdateData;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BuildingController extends Controller
{
    public function __construct(
        private BuildingService $service
    )
    {
    }

    public function list(): JsonResponse
    {
        return $this->success($this->service->list());
    }

    public function showById(int $id): JsonResponse
    {
        return $this->success($this->service->showById($id));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = BuildingInsertData::from($request);
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
        $dto = BuildingUpdateData::from($request);
        try {
            $this->service->update($id, $dto);
            return $this->success();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function deleteImage(int $id, int $imageId): JsonResponse
    {
        try {
            $this->service->deleteImage($id, $imageId);
            return $this->noContent();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function changeMainImage(int $id, int $imageId): JsonResponse
    {
        $this->service->changeMainImage($id, $imageId);
        return $this->noContent();
    }

    public function uploadImage(int $id, Request $request): JsonResponse
    {
        try {
            return $this->success($this->service->uploadImage($id, $request->file('image')));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function switcher(int $id, Request $request): JsonResponse
    {
        try {
            $this->service->switcher($id, $request->get('active'));
            return $this->noContent();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }
}
