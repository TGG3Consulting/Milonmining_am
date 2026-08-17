<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Account\AccountService;
use App\Services\User\Data\UserStoreData;
use App\Services\User\Data\UserUpdateData;
use App\Services\User\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function __construct(
        private AccountService $service,
        private UserService    $userService
    )
    {
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success($this->service->me($request));
    }

    public function list(Request $request): JsonResponse
    {
        return $this->success($this->userService->list($request->get('per_page') ?? 50, $request->get('search')));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = UserStoreData::from($request);
        try {
            return $this->created($this->userService->store($dto));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $dto = UserUpdateData::from($request);
        try {
            return $this->success($this->userService->update($id, $dto));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->destroy($id);
            return $this->noContent();
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode() !== 0 ? $exception->getCode() : Response::HTTP_BAD_REQUEST);
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }
}
