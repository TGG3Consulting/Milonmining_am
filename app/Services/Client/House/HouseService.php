<?php

namespace App\Services\Client\House;

use App\Enum\LocaleEnum;
use App\Services\Client\House\Data\HouseListData;
use Illuminate\Support\Collection;

class HouseService
{
    public function __construct(
        private HouseRepository $repository
    )
    {
    }

    public function list(HouseListData $dto, LocaleEnum $locale): Collection
    {
        return $this->repository->list($dto, $locale);
    }

    public function townhouseSlides(): Collection
    {
        return $this->repository->townhouseSlides();
    }
}
