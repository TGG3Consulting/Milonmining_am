<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Request\Data\RequestInsertData;
use App\Services\Request\Data\RequestListData;
use App\Services\Request\Data\RequestSingleInsertData;
use App\Services\Request\Data\RequestSingleUpdateData;
use App\Services\Request\RequestService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequestController extends Controller
{
    public function __construct(
        private RequestService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list(RequestListData::from($request)));
    }

    public function showById(int $id): JsonResponse
    {
        return $this->success($this->service->showById($id));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = RequestSingleInsertData::from($request);
        try {
            $this->service->store($dto);
            return $this->created();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Exception $exception) {
            return $this->error('something went wrong... please try later');
        }
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $dto = RequestSingleUpdateData::from($request);
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
