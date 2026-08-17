<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Translation\TranslationService;
use Illuminate\Http\JsonResponse;

class TranslationController extends Controller
{
    public function __construct(
        private TranslationService $service
    )
    {
    }

    public function getKeys(string $table): JsonResponse
    {
        return $this->success($this->service->getKeys($table));
    }
}
