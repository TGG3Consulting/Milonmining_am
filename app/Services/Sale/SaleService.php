<?php

namespace App\Services\Sale;

use App\Enum\LocaleEnum;
use App\Services\Apartment\ApartmentRepository;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Garage\Enum\GarageStatusEnum;
use App\Services\Garage\GarageRepository;
use App\Services\House\Enum\HouseStatusEnum;
use App\Services\House\HouseRepository;
use App\Services\Request\Data\RequestInsertData;
use App\Services\Request\Data\RequestSingleInsertData;
use App\Services\Request\RequestRepository;
use App\Services\Resident\Data\ResidentInsertData;
use App\Services\Resident\ResidentRepository;
use App\Services\Sale\Data\SaleApartmentInsertData;
use App\Services\Sale\Data\SaleApartmentListData;
use App\Services\Sale\Data\SaleFinalData;
use App\Services\Sale\Data\SaleHouseInsertData;
use App\Services\Sale\Data\SaleHouseListData;
use App\Services\Sale\Data\SaleUpdateData;
use App\Services\Sale\Enum\SaleBlockEnum;
use App\Services\Sale\Enum\SaleStatusEnum;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SaleService
{
    public function __construct(
        private SaleRepository      $repository,
        private ApartmentRepository $apartmentRepository,
        private ResidentRepository  $residentRepository,
        private RequestRepository   $requestRepository,
        private HouseRepository     $houseRepository,
        private GarageRepository    $garageRepository
    )
    {
    }

    public function apartmentList(SaleApartmentListData $dto): Collection
    {
        return $this->repository->apartmentList($dto);
    }

    public function houseList(SaleHouseListData $dto): Collection
    {
        return $this->repository->houseList($dto);
    }

    public function storeApartment(SaleApartmentInsertData $dto): void
    {
        DB::transaction(function ($query) use ($dto) {
            $apartment = $this->apartmentRepository->getById($dto->apartment_id);
            $garage = null;
            if ($dto->building_garage_id) {
                $garage = $this->garageRepository->getById($dto->building_garage_id);
            }
            if ($apartment->status !== ApartmentStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Apartment already reserved or sold');
            }
            $this->checkAndSetResidentAndRequest($dto, $apartment->id);
            $dto->setApartment($apartment);
            $dto->setGarage($garage);
            $this->repository->store($dto);
            if ($dto->status === SaleStatusEnum::SALE) {
                $apartment->status = ApartmentStatusEnum::SOLD;
            } elseif ($dto->status === SaleStatusEnum::RESERVE) {
                $apartment->status = ApartmentStatusEnum::RESERVED;
            }
            if ($dto->building_garage_id) {
                if ($dto->status === SaleStatusEnum::SALE) {
                    $garage->status = GarageStatusEnum::SOLD;
                } elseif ($dto->status === SaleStatusEnum::RESERVE) {
                    $garage->status = GarageStatusEnum::RESERVED;
                }
            }
            $apartment->save();
        });
    }

    public function storeHouse(SaleHouseInsertData $dto): void
    {
        DB::transaction(function ($query) use ($dto) {
            $house = $this->houseRepository->getById($dto->house_id);
            if ($house->status !== HouseStatusEnum::ACTIVE) {
                throw new \InvalidArgumentException('Apartment already reserved or sold');
            }
            $this->checkAndSetResidentAndRequest($dto, $house->id);
            $dto->setHouse($house);
            $this->repository->store($dto);
            if ($dto->status === SaleStatusEnum::SALE) {
                $house->status = HouseStatusEnum::SOLD;
            } elseif ($dto->status === SaleStatusEnum::RESERVE) {
                $house->status = HouseStatusEnum::RESERVED;
            }
            $house->save();
        });
    }

    public function update(int $saleId, SaleUpdateData $dto): void
    {
        $sale = $this->repository->getById($saleId);
        if ($sale->status !== SaleStatusEnum::RESERVE) {
            throw new \InvalidArgumentException('Տողը կարելի է խմբագրել միայն ռեզերվ կարգավիճակում');
        }
        $this->repository->update($sale, $dto);
    }

    public function sale(int $id, SaleFinalData $dto): void
    {
        DB::transaction(function() use ($id, $dto) {
            $sale = $this->repository->getById($id);
            if ($sale->status !== SaleStatusEnum::RESERVE) {
                throw new \InvalidArgumentException('կարելի է իրականացնել վաճառք միայն ռեզերվ կարգավիճակում');
            }
            $sale->status = SaleStatusEnum::SALE;
            $sale->sale_date = $dto->date;
            $sale->save();
            if($sale->house_id) {
                $house = $sale->house()->first();
                $house->status = HouseStatusEnum::SOLD;
                $house->save();
            } else if($sale->apartment_id) {
                $apartment = $sale->apartment()->first();
                $apartment->status = ApartmentStatusEnum::SOLD;
                $apartment->save();
                if($sale->building_garage_id) {
                    $buildingGarage = $sale->building_garage()->first();
                    $buildingGarage->status = GarageStatusEnum::SOLD;
                    $buildingGarage->save();
                }
            }
        });
    }

    public function cancel(int $id): void
    {
        DB::transaction(function() use ($id) {
            $sale = $this->repository->getById($id);
            if ($sale->status === SaleStatusEnum::CANCELED) {
                throw new \InvalidArgumentException('Տողը արդեն իսկ չեղարկվել է');
            }
            $sale->status = SaleStatusEnum::CANCELED;
            $sale->save();
            if($sale->house_id) {
                $house = $sale->house()->first();
                $house->status = HouseStatusEnum::ACTIVE;
                $house->save();
            } else if($sale->apartment_id) {
                $apartment = $sale->apartment()->first();
                $apartment->status = ApartmentStatusEnum::ACTIVE;
                $apartment->save();
            }
        });
    }

    private function checkAndSetResidentAndRequest(SaleApartmentInsertData|SaleHouseInsertData &$dto, int $relationId): void
    {
        if (!$dto->request_id) {
            if (!$dto->name || !$dto->phone_number) {
                throw new \InvalidArgumentException('Հարցման ընտրությունը կամ Անունը և հեռախոսը պարտադիր են');
            }
        }
        if ($dto->status === SaleStatusEnum::SALE) {
            $resident = $this->residentRepository->getByPhone($dto->phone_number);
            if (!$resident) {
                $resident = $this->residentRepository->store(new ResidentInsertData(
                    $dto->name,
                    $dto->phone_number
                ));
            }
            $dto->setResidentId($resident->id);
        } else {
            if (!$dto->request_id) {
                $request = $this->requestRepository->storeSingle(new RequestSingleInsertData(
                    RequestBlockEnum::from(SaleBlockEnum::APARTMENTS->value),
                    $dto->name,
                    $dto->phone_number,
                    $relationId,
                    null,
                    null,
                    null
                ), LocaleEnum::AM);
                $dto->setRequestId($request->id);
            }
        }
    }


}
