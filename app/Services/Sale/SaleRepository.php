<?php

namespace App\Services\Sale;

use App\Enum\LocaleEnum;
use App\Helpers\SqlHelper;
use App\Models\Apartment;
use App\Models\Building;
use App\Models\BuildingGarage;
use App\Models\Floor;
use App\Models\House;
use App\Models\HouseTranslation;
use App\Models\RequestModel;
use App\Models\Resident;
use App\Models\Sale;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Sale\Data\SaleHouseListData;
use App\Services\Sale\Data\SaleApartmentInsertData;
use App\Services\Sale\Data\SaleApartmentListData;
use App\Services\Sale\Data\SaleHouseInsertData;
use App\Services\Sale\Data\SaleUpdateData;
use App\Services\Sale\Enum\SaleBlockEnum;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SaleRepository
{
    use SqlHelper;
    public function getById(int $id): Sale
    {
        return Sale::query()->findOrFail($id);
    }

    public function apartmentList(SaleApartmentListData $dto): Collection
    {
        return Sale::query()
            ->select([
                'sales.id as sale_id',
                'sales.status',
                'sales.sale_date',
                'sales.block as sale_block',
                'requests.id as request_id',
                'residents.id as resident_id',
                DB::raw("
                    CASE WHEN residents.id THEN residents.name ELSE requests.name END as client_name
                "),
                DB::raw("
                    CASE WHEN residents.id THEN residents.phone_number ELSE requests.phone END as client_phone_number
                "),
                'sales.type',
                'sales.price',
                'sales.discount',
                'sales.garage_price',
                'sales.garage_discount',
                'sales.deposit',
                'sales.block as sale_block',
                'sales.repayment_months_quantity',
                'building_garages.square_meter as garage_square_meter',
                'building_garages.number as garage_number',
                'building_garages.price as garage_price_for_square',
                'building_garages.id as garage_id',
                'building',
                'floor',
                'apartments.number',
                'rooms',
                'apartments.square_meter',
                DB::raw('sales.price / apartments.square_meter as price_for_square'),
                'building_id',
            ])
            ->selectRaw("CONVERT_TZ(sales.created_at, '+00:00', ?) AS created", [self::mysqlTzString($dto->timezone)])
            ->selectRaw("CONVERT_TZ(sales.updated_at, '+00:00', ?) AS updated", [self::mysqlTzString($dto->timezone)])
            ->leftJoinSub(
                Resident::query(),
                'residents',
                'residents.id',
                '=',
                'sales.resident_id'
            )
            ->leftJoinSub(
                RequestModel::query(),
                'requests',
                'requests.id',
                '=',
                'sales.request_id'
            )
            ->joinSub(
                Apartment::query()
                    ->select([
                        'apartments.id',
                        'floors.level as floor',
                        'buildings.name as building',
                        'buildings.id as building_id',
                        'apartments.status',
                        'apartments.number',
                        'apartments.rooms',
                        'apartments.square_meter',
                        'floors.price as floor_price'
                    ])
                    ->joinSub(
                        Building::query()
                            ->joinSub(
                                Translation::query()
                                    ->where('locale', LocaleEnum::AM)
                                    ->select([
                                        'value as name',
                                        'relation_id'
                                    ])
                                    ->joinSub(
                                        TranslationKey::query()->where('key', 'name')
                                            ->where('table_name', 'buildings'),
                                        'keys',
                                        'keys.id',
                                        '=',
                                        'translations.key_id'
                                    ),
                                'translations',
                                'translations.relation_id',
                                '=',
                                'buildings.id'
                            ),
                        'buildings',
                        'buildings.id',
                        '=',
                        'apartments.building_id'
                    )
                    ->joinSub(
                        Floor::query(),
                        'floors',
                        'floors.id',
                        '=',
                        'apartments.floor_id'
                    )
                    ->when($dto->building_id, function ($query) use ($dto) {
                        $query->where('buildings.id', $dto->building_id);
                    })
                    ->when($dto->floor_id, function ($query) use ($dto) {
                        $query->where('floor_id', $dto->floor_id);
                    })
                    ->when($dto->number, function ($query) use ($dto) {
                        $query->where('number', 'LIKE', "%{$dto->number}%");
                    })
                    ->when($dto->square_meter, function ($query) use ($dto) {
                        $query->where('square_meter', '>=', $dto->square_meter);
                    }),
                'apartments',
                'apartments.id',
                '=',
                'sales.apartment_id'
            )
            ->leftJoinSub(
                BuildingGarage::query()
                    ->select([
                        'building_garages.id',
                        'building_garages.square_meter',
                        'building_garages.number',
                        'floors.price',
                    ])
                    ->joinSub(
                        Floor::query(),
                        'floors',
                        'floors.id',
                        '=',
                        'building_garages.floor_id'
                    ),
                'building_garages',
                'building_garages.id',
                '=',
                'sales.building_garage_id'
            )
            ->when($dto->status, function ($query) use ($dto) {
                $query->where('sales.status', $dto->status);
            })
            ->orderBy('sales.updated_at', 'DESC')
            ->limit($dto->limit)
            ->offset($dto->offset)
            ->get();
    }

    public function houseList(SaleHouseListData $dto): Collection
    {
        return Sale::query()
            ->select([
                'sales.id as sale_id',
                'sales.status',
                'sales.block as sale_block',
                'sales.sale_date',
                DB::raw("
                    CASE WHEN residents.id THEN residents.name ELSE requests.name END as client_name
                "),
                DB::raw("
                    CASE WHEN residents.id THEN residents.phone_number ELSE requests.phone END as client_phone_number
                "),
                'sales.type',
                'sales.price',
                'sales.deposit',
                'sales.repayment_months_quantity',
                'address',
                'terrace_size',
            ])
            ->selectRaw("CONVERT_TZ(sales.created_at, '+00:00', ?) AS created", [self::mysqlTzString($dto->timezone)])
            ->selectRaw("CONVERT_TZ(sales.updated_at, '+00:00', ?) AS updated", [self::mysqlTzString($dto->timezone)])
            ->leftJoinSub(
                Resident::query()
                    ->when($dto->search, function ($query) use ($dto) {
                        $query->where(function ($query) use ($dto) {
                            $query->where('name', 'like', '%' . $dto->search . '%')
                                ->orWhere('phone_number', 'like', '%' . $dto->search . '%');
                        });
                    }),
                'residents',
                'residents.id',
                '=',
                'sales.resident_id'
            )
            ->leftJoinSub(
                RequestModel::query()
                    ->when($dto->search, function ($query) use ($dto) {
                        $query->where(function ($query) use ($dto) {
                            $query->where('name', 'like', '%' . $dto->search . '%')
                                ->orWhere('phone', 'like', '%' . $dto->search . '%');
                        });
                    }),
                'requests',
                'requests.id',
                '=',
                'sales.request_id'
            )
            ->joinSub(
                House::query()
                    ->select([
                        'houses.id',
                        'translation.value as address',
                        'terrace_size'
                    ])
                    ->joinSub(
                        HouseTranslation::query()
                            ->when($dto->search, function ($query) use ($dto) {
                                $query->where('value', 'like', '%' . $dto->search . '%');
                            })
                            ->where('key', 'address')->where('locale', LocaleEnum::AM),
                        'translation',
                        'translation.house_id',
                        '=',
                        'houses.id'
                    )
                    ->when($dto->type, function ($query) use ($dto) {
                        return $query->where('type', $dto->type);
                    })
                    ->when($dto->terrace_size, function ($query) use ($dto) {
                        $query->where('terrace_size', '>=', $dto->terrace_size);
                    }),
                'houses',
                'houses.id',
                '=',
                'sales.house_id'
            )
            ->when($dto->status, function ($query) use ($dto) {
                $query->where('sales.status', $dto->status);
            })
            ->limit($dto->limit)
            ->offset($dto->offset)
            ->get();
    }

    public function store(SaleApartmentInsertData|SaleHouseInsertData $dto): Sale
    {
        $sale = new Sale();
        $sale->status = $dto->status;
        $sale->type = $dto->type;
        $sale->sale_date = $dto->sale_date;
        $sale->resident_id = $dto->getResidentId();
        if ($dto instanceof SaleApartmentInsertData) {
            $sale->block = SaleBlockEnum::APARTMENTS;
            $sale->apartment_id = $dto->apartment_id;
            $sale->building_garage_id = $dto->building_garage_id;
            $sale->garage_price = $dto->garage_price ?? $dto->getGarage()?->price;
            $sale->garage_discount = $dto->getGarage()?->discount;
            $sale->price = $dto->getApartment()->square_meter * ($dto->price ?? $dto->getApartment()->floor()->first()->price);
            $sale->discount = $dto->getApartment()->discount;
        } else {
            $sale->block = SaleBlockEnum::HOUSES;
            $sale->house_id = $dto->house_id;
            $sale->price = $dto->price ?? $dto->getHouse()->price;
            $sale->discount = $dto->getHouse()->discount;
        }
        $sale->request_id = $dto->request_id;
//        $sale->deposit = $dto->deposit;
//        $sale->repayment_months_quantity = $dto->repayment_months_quantity;
        $sale->save();
        return $sale;
    }

    public function update(Sale $sale, SaleUpdateData $dto)
    {
        $sale->type = $dto->type;
        $sale->building_garage_id = $dto->building_garage_id;
        $sale->garage_price = $dto->garage_price;
        $sale->price = $dto->price;
        $sale->deposit = $dto->deposit;
        $sale->repayment_months_quantity = $dto->repayment_months_quantity;
        $sale->save();
        return $sale;
    }
}
