<?php

namespace App\Services\Client\Building;

use App\Enum\LocaleEnum;
use App\Services\Client\Apartment\ApartmentRepository;
use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Support\Collection;

class BuildingService
{
    public function __construct(
        private BuildingRepository $repository,
        private ApartmentRepository $apartmentRepository
    )
    {
    }

    public function list(LocaleEnum $locale): Collection
    {
        return $this->repository->list($locale);
    }

    public function getGaragesAvailability(int $apartmentId): bool
    {
        $apartment = $this->apartmentRepository->getById($apartmentId);
        return $apartment->building()->first()->garages()->where('status', GarageStatusEnum::ACTIVE)->exists();
    }
}
