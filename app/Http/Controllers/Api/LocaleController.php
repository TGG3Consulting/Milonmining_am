<?php

namespace App\Http\Controllers\Api;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class LocaleController extends Controller
{
    public function list(): JsonResponse
    {
        return $this->success(LocaleEnum::cases());
    }
}
