<?php

namespace App\Services\Client\Apartment;

use App\Services\Client\Apartment\Data\ApartmentListData;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ApartmentService
{
    public function __construct(
        private ApartmentRepository $repository,
    )
    {
    }

    public function list(ApartmentListData $dto): LengthAwarePaginator
    {
        return $this->repository->list($dto);
    }

    public function featured(): Collection
    {
        return $this->repository->featured();
    }
}
