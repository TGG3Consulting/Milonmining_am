<?php

namespace App\Services\Request;

use App\Enum\LocaleEnum;
use App\Helpers\SqlHelper;
use App\Models\Apartment;
use App\Models\Building;
use App\Models\BuildingGarage;
use App\Models\Floor;
use App\Models\House;
use App\Models\HouseTranslation;
use App\Models\RequestModel;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Client\Request\Enum\RequestTypeEnum;
use App\Services\Request\Data\RequestInsertData;
use App\Services\Request\Data\RequestListData;
use App\Services\Request\Data\RequestSingleInsertData;
use App\Services\Request\Data\RequestSingleUpdateData;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Psr\Http\Message\RequestInterface;

class RequestRepository
{
    use SqlHelper;

    public function list(RequestListData $dto): Collection
    {
        return RequestModel::query()
            ->select([
                'requests.id',
                'requests.block',
                'requests.type',
                'requests.want_garage',
                'requests.relation_id',
                'requests.from_staff',
                'requests.name',
                'requests.phone',
                'requests.preferred_price',
                'apartments.id as apartment_id',
                'apartments.building_name',
                'apartments.level as floor_level',
                'apartments.number as apartment_number',
                'apartments.square_meter as apartment_square_meter',
                'apartments.rooms as apartment_rooms',
                'houses.id as house_id',
                'houses.address as house_address',
                'houses.terrace_size as house_terrace_size',
                DB::raw("
                    CASE WHEN requests.block = '" . RequestBlockEnum::APARTMENTS->value . "'
                    THEN apartments.status
                    ELSE houses.status
                    END as status
                "),
                "garages.id as garage_id",
                "garages.number as garage_number",
                "garages.square_meter as garage_square_meter",
                "garages.floor as garage_floor",
            ])
            ->selectRaw('DATE(CONVERT_TZ(requests.created_at, "+00:00", ?)) as created', [self::mysqlTzString($dto->timezone)])
            ->when($dto->search, function ($query) use ($dto) {
                $query->where(function ($query) use ($dto) {
                    $query->where('name', 'like', '%' . $dto->search . '%')
                        ->orWhere('phone', 'like', '%' . $dto->search . '%');
                });
            })
            ->when($dto->block, function($query) use($dto) {
                $query->where('block', $dto->block);
            })
            ->leftJoinSub(
                Apartment::query()
                    ->select([
                        'apartments.id',
                        'apartments.building_id',
                        'buildings.name as building_name',
                        'floors.level',
                        'apartments.number',
                        'apartments.square_meter',
                        'apartments.rooms',
                        'apartments.status'
                    ])
                    ->joinSub(
                        Floor::query(),
                        'floors',
                        'floors.id',
                        '=',
                        'apartments.floor_id'
                    )
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
                    ->when($dto->square_meter, function($query) use($dto) {
                        $query->where('square_meter', '>=', $dto->square_meter);
                    })
                    ->when($dto->number, function($query) use($dto) {
                        $query->where('number', 'like', '%'.$dto->number.'%');
                    }),
                'apartments',
                function ($join) {
                    $join->on('apartments.id', '=', 'requests.relation_id')
                        ->where('requests.block', RequestBlockEnum::APARTMENTS->value);
                },
            )
            ->leftJoinSub(
                BuildingGarage::query()
                    ->select([
                        'building_garages.id',
                        'building_garages.square_meter',
                        'building_garages.number',
                        'floors.level as floor',
                    ])
                    ->joinSub(
                        Floor::query(),
                        'floors',
                        'floors.id',
                        '=',
                        'building_garages.floor_id'
                    ),
                'garages',
                'garages.id',
                '=',
                'requests.building_garage_id'
            )
            ->leftJoinSub(
                House::query()
                    ->select([
                        'houses.id',
                        'houses.status',
                        'houses.terrace_size',
                        'translation.value as address',
                    ])
                    ->joinSub(
                        HouseTranslation::query()->where('key', 'address')->where('locale', LocaleEnum::AM),
                        'translation',
                        'translation.house_id',
                        '=',
                        'houses.id'
                    )
                    ->when($dto->search, function ($query) use ($dto) {
                        $query->where('translation.value', 'like', '%' . $dto->search . '%');
                    }),
                'houses',
                function ($join) {
                    $join->on('houses.id', '=', 'requests.relation_id')
                        ->where('requests.block', RequestBlockEnum::HOUSES->value);
                },
            )
            ->when($dto->building_id, function($query) use($dto) {
                $query->where('apartments.building_id', $dto->building_id);
            })
            ->when($dto->status, function($query) use($dto) {
                $query->where(function($query) use($dto) {
                    $query->where('apartments.status', $dto->status)
                        ->orWhere('houses.status', $dto->status);
                });
            })
            ->orderBy('requests.updated_at', 'DESC')
            ->limit($dto->limit)
            ->offset($dto->offset)
            ->get();
    }

    public function showById(int $id): array
    {
        $request = $this->getById($id);
        return [
            'id' => $request->id,
            'preferred_price' => $request->preferred_price,
            'name' => $request->name,
            'phone_number' => $request->phone,
            'type' => [
                'name' => $request->type,
                'key' => $request->type
            ],
            'block' => [
                'name' => $request->block,
                'key' => $request->block
            ],
            'building' => [
                'name' => Translation::query()
                    ->where('locale', LocaleEnum::AM)
                    ->where('relation_id', $request->apartment?->building_id)
                    ->whereIn('key_id', TranslationKey::query()->select('id')->where('key', 'name')->where('table_name', 'buildings'))
                    ->first()->value,
                'id' => $request->apartment?->building_id
            ],
            'floor' => [
                'id' => $request->apartment?->floor->id,
                'level' => $request->apartment?->floor->level,
            ],
            'apartment' => $request->block === RequestBlockEnum::APARTMENTS ? [
                'id' => $request->relation_id,
                'floor' => $request->apartment?->floor->level,
                'number' => $request->apartment?->number,
                'discount' => $request->apartment?->discount,
                'rooms' => $request->apartment?->rooms,
                'square_meter' => $request->apartment?->square_meter,
                'price_for_square' => $request->apartment?->floor->price
            ] : null,
            'house' => $request->block === RequestBlockEnum::HOUSES ? [
                'id' => $request->relation_id,
                'address' => $request->house?->translations->where('key', 'address')->where('locale', 'am')->first()->value,
                'floors_sum_square_meter' => $request->house?->floors->sum('square_meter'),
                'terrace_size' => $request->house?->terrace_size,
                'price' => $request->house?->price,
                'floors' => $request->house?->floors
            ] : null,
            'garage' => $request->block === RequestBlockEnum::APARTMENTS && $request->building_garage_id ? [
                'id' => $request->building_garage_id,
                'floor' => $request->building_garage?->floor->level,
                'number' => $request->building_garage?->number,
                'square_meter' => $request->building_garage?->square_meter,
                'price' => $request->building_garage?->price,
            ] : null,
            'reserve' => $request->sale_reserve
        ];
    }


    public function store(RequestInsertData $dto, LocaleEnum $locale): array
    {
        $requests = [];
        foreach ($dto->relation_ids as $relation_id) {
            if (!$this->checkBeforeStore($dto, $relation_id)) {
                $request = new RequestModel();
                $request->type = $dto->type;
                $request->from_staff = true;
                $request->relation_id = $relation_id;
                $request->locale = $locale;
                $request->name = $dto->name;
                $request->phone = $dto->phone_number;
                $request->save();
                $requests[] = $request;
            }
        }
        return $requests;
    }

    public function storeSingle(RequestSingleInsertData $dto): RequestModel
    {
        $request = new RequestModel();
        $request->block = $dto->block;
        $request->type = RequestTypeEnum::RESERVE;
        $request->from_staff = true;
        $request->relation_id = $dto->relation_id;
        $request->locale = LocaleEnum::AM;
        $request->name = $dto->name;
        $request->phone = $dto->phone_number;
        $request->building_garage_id = $dto->garage_relation_id;
        $request->comments = $dto->comments;
        $request->preferred_price = $dto->preferred_price;
        $request->save();
        return $request;
    }

    public function updateSingle(RequestModel $request, RequestSingleUpdateData $dto): RequestModel
    {
        $request->block = $dto->block;
        $request->from_staff = true;
        $request->relation_id = $dto->relation_id;
        $request->locale = LocaleEnum::AM;
        $request->name = $dto->name;
        $request->phone = $dto->phone_number;
        $request->building_garage_id = $dto->garage_relation_id;
        $request->comments = $dto->comments;
        $request->preferred_price = $dto->preferred_price;
        $request->save();
        return $request;
    }

    private function checkBeforeStore(RequestInsertData $dto, int $relationId): ?RequestModel
    {
        return RequestModel::query()
            ->where('type', $dto->type)
            ->where('relation_id', $relationId)
            ->where('phone', $dto->phone_number)
            ->first();
    }

    public function getById(int $id): RequestModel
    {
        return RequestModel::query()
            ->with(['apartment', 'apartment.floor', 'house', 'house.floors', 'house.translations', 'building_garage', 'building_garage.floor', 'sale_reserve.building_garage'])
            ->findOrFail($id);
    }
}
