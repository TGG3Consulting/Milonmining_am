<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Discount\Data\DiscountInsertData;
use App\Services\Discount\Data\DiscountUpsertByProduct;
use App\Services\Discount\DiscountService;
use App\Services\Discount\Enum\DiscountBlockEnum;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DiscountController extends Controller
{
    public function __construct(
        private DiscountService $service
    )
    {
    }

    public function list(string $block): JsonResponse
    {
        return $this->success($this->service->list(DiscountBlockEnum::from($block)));
    }

    public function store(Request $request): JsonResponse
    {
        $dto = DiscountInsertData::from($request);
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

    public function updateByProduct(Request $request): JsonResponse
    {
        $this->service->updateByProduct(DiscountUpsertByProduct::from($request));
        return $this->success();
    }

    public function archive(int $id): JsonResponse
    {
        $this->service->archive($id);
        return $this->noContent();
    }
}
