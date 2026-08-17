<?php

namespace App\Services\Client\Apartment;

use App\Enum\LocaleEnum;
use App\Models\Apartment;
use App\Models\Floor;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Client\Apartment\Data\ApartmentListData;
use App\Services\File\FileService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ApartmentRepository
{
    use FileService;

    public function list(ApartmentListData $dto)
    {
        $disk = Storage::disk($this->getDisk());

        $queryBuilder = Apartment::query()
            ->select([
                'apartments.id',
                'apartments.status',
                'apartments.floor_id',
                'apartments.square_meter',
                'apartments.rooms',
                'apartments.discount',
                'apartments.image',
                'apartments.active_price',
                'apartments.parent_image'
            ])
            ->join('floors as f', 'f.id', '=', 'apartments.floor_id')
            ->where('status', '!=', ApartmentStatusEnum::PENDING)
            ->whereIn('status', $dto->available
                ? [ApartmentStatusEnum::ACTIVE]
                : [ApartmentStatusEnum::SOLD, ApartmentStatusEnum::RESERVED])
            ->when($dto->rooms, fn($q) => $q->where('rooms', $dto->rooms))
            ->when($dto->building_id, fn($q) => $q->where('apartments.building_id', $dto->building_id))
            ->when($dto->duplex, fn($q) => $q->where('duplex', true))
            ->when($dto->square_from, fn($q) => $q->where('square_meter', '>=', $dto->square_from))
            ->when($dto->floor_level, function ($q) use ($dto) {
                $q->whereHas('floor', fn($qq) => $qq->where('level', $dto->floor_level));
            })
            ->with(['floor:id,level,price']);
        $priceField = 'CASE
        WHEN apartments.discount IS NOT NULL THEN (apartments.square_meter * COALESCE(apartments.active_price, 0)) * (1 - apartments.discount/100.0)
        ELSE (apartments.square_meter * COALESCE(apartments.active_price, 0))
     END';
        $priceFieldRaw = DB::raw($priceField);
        if (!is_null($dto->price_from) && !is_null($dto->price_to)) {
            $queryBuilder->whereBetween($priceFieldRaw, [$dto->price_from, $dto->price_to]);
        } elseif (!is_null($dto->price_from)) {
            $queryBuilder->where($priceFieldRaw, '>=', $dto->price_from);
        } elseif (!is_null($dto->price_to)) {
            $queryBuilder->where($priceFieldRaw, '<=', $dto->price_to);
        }
        switch ($dto->sort) {
            case 'price_asc':
                // by effective (discounted) price, low > high
                $queryBuilder->orderByRaw("{$priceField} ASC");
                break;

            case 'price_desc':
                // by effective (discounted) price, high > low
                $queryBuilder->orderByRaw("{$priceField} DESC");
                break;

            case 'size_asc':
                // by square meters, low > high
                $queryBuilder->orderBy('apartments.square_meter', 'ASC');
                break;

            case 'size_desc':
                // by square meters, high > low
                $queryBuilder->orderBy('apartments.square_meter', 'DESC');
                break;

            default:
                $queryBuilder->orderByRaw("{$priceField} DESC"); // sensible default
                break;
        }
        $paginator = $queryBuilder->paginate(20);

        // keep meta/links; just map each item
        $paginator = $paginator->through(function ($apartment) use ($disk) {
            return [
                'id' => $apartment->id,
                'number' => $apartment->number,
                'building' => $apartment->building,
                'block' => $apartment->block,
                'floor_level' => $apartment->floor->level,
                'square_meter' => $apartment->square_meter,
                'rooms' => $apartment->rooms,
                'price' => $apartment->square_meter * $apartment->active_price,
                'discount_price' => ($apartment->square_meter * $apartment->active_price) - (($apartment->discount ?? 0) * ($apartment->square_meter * $apartment->active_price) / 100),
                'square_meter_price' => $apartment->active_price,
                'image' => $apartment->image
                    ? $disk->url($apartment->image, now()->addSeconds(3600))
                    : null,
                'parent_image' => $apartment->parent_image
                    ? $disk->url($apartment->parent_image, now()->addSeconds(3600))
                    : null,
                'status' => $apartment->status,
                'discount' => $apartment->discount,
            ];
        });

        return $paginator;
    }

    public function featured(): Collection
    {
        $disk = Storage::disk($this->getDisk());

        return Apartment::query()
            ->where('for_main', true)
            ->limit(20)
            ->with(['floor', 'block', 'building.translations'])
            ->get()
            ->map(function (Apartment $apartment) use ($disk) {
                return [
                    'id' => $apartment->id,
                    'number' => $apartment->number,
                    'building' => $apartment->building?->translations?->where('key', 'name')->where('locale', LocaleEnum::AM)->first()?->value,
                    'block' => $apartment->block?->name,
                    'floor_level' => $apartment->floor->level,
                    'rooms' => $apartment->rooms,
                    'square_meter' => $apartment->square_meter,
                    'price' => $apartment->square_meter * $apartment->active_price,
                    'square_meter_price' => $apartment->active_price,
                    'image' => $apartment->image
                        ? $disk->url($apartment->image, now()->addSeconds(3600))
                        : null,
                    'parent_image' => $apartment->parent_image
                        ? $disk->url($apartment->parent_image, now()->addSeconds(3600))
                        : null,
                    'status' => $apartment->status,
                    'discount_price' => ($apartment->square_meter * $apartment->active_price) - (($apartment->discount ?? 0) * ($apartment->square_meter * $apartment->active_price) / 100),
                    'discount' => $apartment->discount,
                ];
            });
    }

    public function getById(int $id): Apartment
    {
        return Apartment::query()->findOrFail($id);
    }
}
