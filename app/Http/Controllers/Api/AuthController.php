<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use App\Services\Auth\Data\AuthLoginData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $service
    )
    {
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $dto = AuthLoginData::from($request);
            return $this->success($this->service->login($dto));
        } catch (\InvalidArgumentException $exception) {
            return $this->error($exception->getMessage(), $exception->getCode());
        }
    }

    /**
     * Revoke ONLY the current token (the one used in this request).
     * Route must be protected with auth:sanctum.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return $this->success(null, 'Logged out');
    }

    /**
     * Revoke ALL tokens for the authenticated user (logout everywhere).
     * Route must be protected with auth:sanctum.
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $count = $request->user()->tokens()->delete();

        return $this->success(['revoked' => $count], 'Logged out on all devices');
    }
}
