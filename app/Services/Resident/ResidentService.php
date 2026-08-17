<?php

namespace App\Services\Resident;

use App\Models\Resident;
use App\Services\Resident\Data\ResidentInsertData;

class ResidentService
{
    public function __construct(
        private ResidentRepository $repository
    )
    {
    }

    public function store(ResidentInsertData $dto)
    {

    }

    public function getByPhone(string $phone): ?Resident
    {
        return $this->repository->getByPhone($phone);
    }
}
