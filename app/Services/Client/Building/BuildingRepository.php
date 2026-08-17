<?php

namespace App\Services\Client\Building;

use App\Enum\LocaleEnum;
use App\Models\Building;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Building\Enum\BuildingStatusEnum;
use App\Services\File\FileService;
use App\Services\Garage\Enum\GarageStatusEnum;
use Illuminate\Support\Facades\Storage;

class BuildingRepository
{
    use FileService;

    public function list(LocaleEnum $locale)
    {
        $disk = Storage::disk($this->getDisk());

        return Building::query()
            ->select([
                'buildings.id',
                'translation_name.value as name',
                'translation_address.value as address',
                'buildings.start_date',
                'buildings.end_date',
                'buildings.main_image_id',
            ])
            ->joinSub(
                Translation::query()->where('locale', $locale)
                    ->select([
                        'translations.relation_id',
                        'translations.value'
                    ])
                    ->joinSub(
                        TranslationKey::query()->where('table_name', 'buildings')->where('key', 'name'),
                        'name_key',
                        'name_key.id',
                        '=',
                        'translations.key_id'
                    ),
                'translation_name',
                'translation_name.relation_id',
                '=',
                'buildings.id'
            )
            ->joinSub(
                Translation::query()->where('locale', $locale)
                    ->select([
                        'translations.relation_id',
                        'translations.value'
                    ])
                    ->joinSub(
                        TranslationKey::query()->where('table_name', 'buildings')->where('key', 'address'),
                        'address_key',
                        'address_key.id',
                        '=',
                        'translations.key_id'
                    ),
                'translation_address',
                'translation_address.relation_id',
                '=',
                'buildings.id'
            )
            ->orderBy('id', 'asc')
            ->where('status', BuildingStatusEnum::ACTIVE)
            ->with(['apartments', 'main_image', 'floors', 'garages'])
            ->get()
            ->map(function (Building $building) use ($disk) {
                return [
                    'id' => $building->id,
                    'start' => $building->start_date,
                    'end' => $building->end_date,
                    'main_image' => $building->main_image ? $disk->url($building->main_image->path, now()->addSeconds(3600)) : null,
                    'name' => $building->name,
                    'address' => $building->address,
                    'units' => $building->apartments->count(),
                    'available' => $building->apartments->where('status', ApartmentStatusEnum::ACTIVE)->count(),
                    'areaMin' => $building->apartments->min('square_meter'),
                    'areaMax' => $building->apartments->max('square_meter'),
                    'parking' => $building->garages->count(),
                    'coords' => [
                        'lat' => 40.27146521335858,
                        'lng' => 44.61866758168769
                    ],
                    'images' => $building->images?->map(function ($image) use ($disk) {
                        return $disk->url($image->path, now()->addSeconds(3600));
                    }),
                    'floors_qty' => $building->floors->count(),
                ];
            });
    }

    public function getById(int $id): Building
    {
        return Building::query()->findOrFail($id);
    }
}
