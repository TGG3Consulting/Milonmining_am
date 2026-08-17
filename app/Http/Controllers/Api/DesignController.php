<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Design\Data\DesignInsertData;
use App\Services\Design\Data\DesignUpdateData;
use App\Services\Design\DesignService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DesignController extends Controller
{
    public function __construct(
        private DesignService $service
    )
    {
    }

    public function list(): JsonResponse
    {
        return $this->success($this->service->list());
    }

    public function getById(int $id): JsonResponse
    {
        return $this->success($this->service->getById($id));
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


    public function store(Request $request): JsonResponse
    {
        $dto = DesignInsertData::from($request);
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
        $dto = DesignUpdateData::from($request);
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
}
