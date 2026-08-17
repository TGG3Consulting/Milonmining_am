<?php

namespace App\Services\Discount;

use App\Models\Discount;
use App\Services\Discount\Data\DiscountInsertData;
use App\Services\Discount\Enum\DiscountBlockEnum;
use App\Services\Discount\Enum\DiscountStatusEnum;
use Illuminate\Support\Collection;

class DiscountRepository
{

    public function list(DiscountBlockEnum $block): Collection
    {
        return Discount::query()
            ->where('block', $block)
            ->get();
    }

    public function store(DiscountInsertData $dto): Discount
    {
        $discount = new Discount();
        $discount->filter = $dto->filter;
        $discount->value = $dto->value;
        $discount->block = $dto->block;
        $discount->save();
        return $discount;
    }

    public function checkExist(DiscountInsertData $dto): bool
    {
        return Discount::query()
            ->whereJsonContains('filter', $dto->filter)
            ->where('value', $dto->value)
            ->where('block', $dto->block)
            ->where('status', DiscountStatusEnum::ACTIVE)
            ->exists();
    }

    public function getById(int $id): Discount
    {
        return Discount::query()->findOrFail($id);
    }
}
