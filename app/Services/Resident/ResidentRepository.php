<?php

namespace App\Services\Resident;

use App\Models\Resident;
use App\Services\Resident\Data\ResidentInsertData;

class ResidentRepository
{
    public function store(ResidentInsertData $dto): Resident
    {
        $resident = new Resident();
        $resident->name = $dto->name;
        $resident->phone_number = $dto->phone;
        $resident->save();
        return $resident;
    }

    public function getByPhone(string $phone): ?Resident
    {
        return Resident::query()
            ->where('phone_number', $phone)
            ->first();
    }
}
