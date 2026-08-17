<?php

namespace App\Services\Garage;

use App\Enum\LocaleEnum;
use App\Models\Building;
use App\Models\BuildingGarage;
use App\Models\Floor;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Garage\Data\GarageListData;
use App\Services\Garage\Data\GarageUpsertData;
use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GarageRepository
{

    public function list(GarageListData $dto): Collection
    {
        return BuildingGarage::query()
            ->select([
                'building_garages.id',
                'building_garages.discount',
                'building_garages.square_meter',
                'building_garages.number',
                'building_garages.price',
                'building_garages.status',
                'floors.level as floor',
                'floors.building_name',
                'floors.price as price_for_square',
                DB::raw("
                    CASE WHEN building_garages.status = 'pending' THEN false ELSE true END as active
                ")
            ])
            ->joinSub(
                Floor::query()
                    ->select([
                        'floors.id',
                        'floors.level',
                        'floors.price',
                        'buildings.name as building_name',
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
                        'floors.building_id'
                    )
                    ->when($dto->building_id, function ($query) use ($dto) {
                        return $query->where('building_id', $dto->building_id);
                    })
                    ->when($dto->floor_id, function ($query) use ($dto) {
                        return $query->where('floors.id', $dto->floor_id);
                    }),
                'floors',
                'floors.id',
                '=',
                'building_garages.floor_id'
            )
            ->when($dto->square_meter, function ($query) use ($dto) {
                $query->where('building_garages.square_meter', '>=', $dto->square_meter);
            })
            ->when($dto->number, function ($query) use ($dto) {
                $query->where('number', 'like', '%' . $dto->number . '%');
            })
            ->when($dto->status, function($query) use ($dto) {
                $query->where('status', $dto->status);
            })
            ->limit($dto->limit)
            ->offset($dto->offset)
            ->get();
    }

    public function showById(int $id): array
    {
        $garage = $this->getById($id);
        return [
            'building' => [
                'name' => Translation::query()
                    ->where('locale', LocaleEnum::AM)
                    ->where('relation_id', $garage->building_id)
                    ->whereIn('key_id', TranslationKey::query()->select('id')->where('key', 'name')->where('table_name', 'buildings'))
                    ->first()->value,
                'id' => $garage->building_id
            ],
            'floor' => [
                'level' => $garage->floor->level,
                'id' => $garage->floor_id
            ],
            'number' => $garage->number,
            'price' => $garage->price,
            'square_meter' => $garage->square_meter,
            'id' => $garage->id
        ];
    }

    public function store(Floor $floor, GarageUpsertData $dto): void
    {
        $garage = new BuildingGarage();
        $garage->building_id = $floor->building_id;
        $garage->floor_id = $floor->id;
        $garage->number = $dto->number;
        $garage->price = $dto->price;
        $garage->square_meter = $dto->square_meter;
        $garage->status = GarageStatusEnum::PENDING;
        $garage->save();
    }

    public function update(BuildingGarage $garage, Floor $floor, GarageUpsertData $dto): void
    {
        $garage->building_id = $floor->building_id;
        $garage->floor_id = $floor->id;
        $garage->number = $dto->number;
        $garage->price = $dto->price;
        $garage->square_meter = $dto->square_meter;
        $garage->save();
    }

    public function getById(int $id): BuildingGarage
    {
        return BuildingGarage::query()
            ->with(['building', 'floor'])
            ->findOrFail($id);
    }
}
