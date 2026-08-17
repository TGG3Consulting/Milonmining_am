<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Role\Data\RoleUpsertData;
use App\Services\Role\RoleService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleController extends Controller
{
    public function __construct(
        private RoleService $service
    )
    {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->service->list($request->get('search')));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = RoleUpsertData::from($request);
        try {
            return $this->created($this->service->store($dto));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $dto = RoleUpsertData::from($request);
        try {
            return $this->success($this->service->update($id, $dto));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->service->destroy($id);
            return $this->noContent();
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }
}
