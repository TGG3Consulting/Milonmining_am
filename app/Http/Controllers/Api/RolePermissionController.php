<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Role\Data\Permission\RolePermissionIdsBatchData;
use App\Services\Role\Permission\RolePermissionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\HttpFoundation\Response;

class RolePermissionController extends Controller
{
    public function __construct(
        private RolePermissionService $service
    )
    {
    }

    public function list(Request $request, int $roleId): JsonResponse
    {
        return $this->success($this->service->list($roleId, $request->get('per_page') ?? 50, $request->get('search')));
    }

    public function attach(Request $request, int $roleId): JsonResponse
    {
        $dto = RolePermissionIdsBatchData::from($request);
        try {
            return $this->success($this->service->attach($roleId, $dto));
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }

    public function detach(Request $request, int $roleId): JsonResponse
    {
        $dto = RolePermissionIdsBatchData::from($request);
        try {
            return $this->success($this->service->detach($roleId, $dto));
        } catch (ModelNotFoundException $exception) {
            return $this->error($exception->getMessage(), Response::HTTP_NOT_FOUND);
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }

    }

    public function syncPermissions(Request $request): JsonResponse
    {
        try {
            $prune = $request->boolean('prune', false);

            // run command
            $code = Artisan::call('permissions:sync-from-routes', [
                '--guard' => 'api',
                '--prune' => $prune,
            ]);

            $output = Artisan::output();

            return $this->success([
                'exit_code' => $code,
                'output'    => $output,
                'pruned'    => $prune,
            ], 'Sync completed');
        } catch (\Throwable $exception) {
            return $this->error('something went wrong...', 500);
        }
    }
}
