<?php

namespace App\Services\Apartment;

use App\Enum\LocaleEnum;
use App\Models\Apartment;
use App\Models\Block;
use App\Models\Building;
use App\Models\Floor;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Apartment\Data\ApartmentInsertData;
use App\Services\Apartment\Data\ApartmentListData;
use App\Services\Apartment\Data\ApartmentUpdateData;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\File\FileService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ApartmentRepository
{
    use FileService;

    public function list(ApartmentListData $dto): Collection
    {
        $disk = Storage::disk($this->getDisk());
        return Apartment::query()
            ->select([
                'apartments.id',
                'apartments.discount',
                'apartments.for_main',
                'apartments.active_price',
                'buildings.name as building',
                'floors.level as floor',
                'apartments.active_price as price_per_square',
                'blocks.name as block',
                'apartments.status',
                'apartments.number',
                'apartments.rooms',
                'apartments.square_meter',
                'apartments.image',
                'apartments.parent_image',
                DB::raw("
                    CASE WHEN apartments.status = 'pending' THEN false ELSE true END as active
                ")
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
            ->joinSub(
                Block::query(),
                'blocks',
                'blocks.id',
                '=',
                'apartments.block_id'
            )
            ->when($dto->building_id, function ($query) use ($dto) {
                $query->where('apartments.building_id', $dto->building_id);
            })
            ->when($dto->floor_id, function ($query) use ($dto) {
                $query->where('floor_id', $dto->floor_id);
            })
            ->when($dto->for_main, function ($query) use ($dto) {
                $query->where('for_main', $dto->for_main);
            })
            ->when($dto->rooms, function ($query) use ($dto) {
                $query->where('rooms', $dto->rooms);
            })
            ->when($dto->status, function ($query) use ($dto) {
                $query->where('apartments.status', $dto->status);
            })
            ->when($dto->number, function ($query) use ($dto) {
                $query->where('number', 'LIKE', "%{$dto->number}%");
            })
            ->when($dto->square_meter, function ($query) use ($dto) {
                $query->where('square_meter', '>', $dto->square_meter);
            })
            ->limit($dto->limit)
            ->offset($dto->offset)
            ->orderByRaw('apartments.number+0, apartments.number')
            ->get()
            ->map(function ($apartment) use ($disk) {
                return [
                    'active' => $apartment->active,
                    'block' => $apartment->block,
                    'building' => $apartment->building,
                    'floor' => $apartment->floor,
                    'id' => $apartment->id,
                    'for_main' => $apartment->for_main,
                    'discount' => $apartment->discount,
                    'price' => $apartment->active_price,
                    'price_per_square' => $apartment->price_per_square,
                    'number' => $apartment->number,
                    'rooms' => $apartment->rooms,
                    'square_meter' => $apartment->square_meter,
                    'status' => $apartment->status,
                    'image' => $apartment->image ? $disk->url($apartment->image, now()->addSeconds(360)) : null,
                    'parent_image' =>$apartment->parent_image ? $disk->url($apartment->parent_image, now()->addSeconds(360)) : null,
                ];
            });
    }

    public function getById(int $id): Apartment
    {
        return Apartment::query()
            ->with('building.translations', 'floor', 'block')
            ->findOrFail($id);
    }

    public function showById(int $id): array
    {
        $apartment = $this->getById($id);
        $disk = Storage::disk($this->getDisk());
        return [
            'building' => [
                'name' => Translation::query()
                    ->where('locale', LocaleEnum::AM)
                    ->where('relation_id', $apartment->building_id)
                    ->whereIn('key_id', TranslationKey::query()->select('id')->where('key', 'name')->where('table_name', 'buildings'))
                    ->first()->value,
                'id' => $apartment->building_id
            ],
            'floor' => [
                'level' => $apartment->floor->level,
                'id' => $apartment->floor_id
            ],
            'block' => [
                'name' => $apartment->block->name,
                'id' => $apartment->block_id
            ],
            'number' => $apartment->number,
            'rooms' => $apartment->rooms,
            'discount' => $apartment->discount,
            'price' => $apartment->active_price,
            'square_meter' => $apartment->square_meter,
            'image' => $apartment->image ? $disk->url($apartment->image, now()->addSeconds(360)) : null,
            'parent_image' => $apartment->image ? $disk->url($apartment->parent_image, now()->addSeconds(360)) : null,
            'id' => $apartment->id,
            'price_for_square' => $apartment->floor->price,
        ];
    }

    public function store(ApartmentInsertData $dto): Apartment
    {
        return DB::transaction(function () use ($dto) {
            $image = null;
            $parentImage = null;
            if ($dto->image) {
                $image = self::upload($dto->image, '/buildings/' . $dto->building_id . '/apartments/' . $dto->number);
            }
            if ($dto->parent_image) {
                $parentImage = self::upload($dto->parent_image, '/buildings/' . $dto->building_id . '/apartments/' . $dto->number);
            }
            $apartment = new Apartment();
            $apartment->building_id = $dto->building_id;
            $apartment->block_id = $dto->block_id;
            $apartment->floor_id = $dto->floor_id;
            $apartment->rooms = $dto->rooms;
            $apartment->number = $dto->number;
            $apartment->duplex = $dto->duplex;
            $apartment->square_meter = $dto->square_meter;
            $apartment->image = $image;
            $apartment->parent_image = $parentImage;
            $apartment->active_price = $dto->price;
            $apartment->status = ApartmentStatusEnum::PENDING;
            $apartment->save();
            return $apartment;
        });
    }

    public function update(Apartment $apartment, ApartmentUpdateData $dto): Apartment
    {
        if($apartment->status === ApartmentStatusEnum::PENDING) {
            $apartment->building_id = $dto->building_id;
            $apartment->block_id = $dto->block_id;
            $apartment->floor_id = $dto->floor_id;
        }
        $apartment->rooms = $dto->rooms;
        $apartment->duplex = $dto->duplex;
        $apartment->number = $dto->number;
        $apartment->square_meter = $dto->square_meter;
        $apartment->active_price = $dto->price;
        $image = $apartment->image;
        if ($dto->image) {
            self::deleteFile($image);
            $image = self::upload($dto->image, '/buildings/' . $dto->building_id . '/apartments/' . $dto->number);
        }
        $parentImage = $apartment->parent_image;
        if ($dto->parent_image) {
            self::deleteFile($parentImage);
            $parentImage = self::upload($dto->parent_image, '/buildings/' . $dto->building_id . '/apartments/' . $dto->number);
        }
        $apartment->image = $image;
        $apartment->parent_image = $parentImage;
        $apartment->save();
        return $apartment;
    }
}
