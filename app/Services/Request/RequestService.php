<?php

namespace App\Services\Request;

use App\Enum\LocaleEnum;
use App\Services\Apartment\ApartmentRepository;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Garage\Enum\GarageStatusEnum;
use App\Services\Garage\GarageRepository;
use App\Services\House\Enum\HouseStatusEnum;
use App\Services\House\HouseRepository;
use App\Services\Request\Data\RequestInsertData;
use App\Services\Request\Data\RequestListData;
use App\Services\Request\Data\RequestSingleInsertData;
use App\Services\Request\Data\RequestSingleUpdateData;
use Illuminate\Support\Collection;

class RequestService
{
    public function __construct(
        private RequestRepository   $repository,
        private ApartmentRepository $apartmentRepository,
        private HouseRepository     $houseRepository,
        private GarageRepository    $garageRepository
    )
    {
    }

    public function list(RequestListData $dto): Collection
    {
        return $this->repository->list($dto);
    }

    public function showById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function store(RequestSingleInsertData $dto): void
    {
        $this->repository->storeSingle($dto);
    }

    public function update(int $id, RequestSingleUpdateData $dto): void
    {
        $request = $this->repository->getById($id);
        if ($request->type === RequestBlockEnum::APARTMENTS) {
            $relation = $this->apartmentRepository->getById($dto->relation_id);
            if ($relation->status !== ApartmentStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Ընտրված բնակարանը ակտիվ չէ');
            }
            if ($dto->garage_relation_id) {
                $garage = $this->garageRepository->getById($dto->garage_relation_id);
                if ($garage->status !== GarageStatusEnum::ACTIVE) {
                    throw new \InvalidArgumentException('Ընտրված ավտոտնակը ակտիվ չէ');
                }
            }
        }
        if ($request->type === RequestBlockEnum::HOUSES) {
            $relation = $this->houseRepository->getById($dto->relation_id);
            if ($relation->status !== HouseStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Ընտրված տունը ակտիվ չէ');
            }
        }
        $this->repository->updateSingle($request, $dto);
    }
}
