<?php

namespace App\Services\House;

use App\Enum\LocaleEnum;
use App\Models\House;
use App\Models\HouseFloor;
use App\Models\HouseTranslation;
use App\Services\File\FileService;
use App\Services\House\Data\HouseFloorData;
use App\Services\House\Data\HouseInsertData;
use App\Services\House\Data\HouseListData;
use App\Services\House\Data\HouseTranslationData;
use App\Services\House\Data\HouseUpdateData;
use App\Services\House\Enum\HouseStatusEnum;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HouseRepository
{
    use FileService;

    public function list(HouseListData $dto): Collection
    {
        return House::query()
            ->select([
                'translation.value as address',
                'houses.id',
                'houses.discount',
                'houses.type',
                'houses.price',
                'houses.status',
                DB::raw("
                    CASE WHEN houses.status = 'pending' THEN false ELSE true END as active
                ")
            ])
            ->joinSub(
                HouseTranslation::query()->where('key', 'address')->where('locale', LocaleEnum::AM),
                'translation',
                'translation.house_id',
                '=',
                'houses.id'
            )
            ->when($dto->status, function ($query, $dto) {
                $query->where('status', $dto->status);
            })
            ->withSum('floors','square_meter')
            ->orderBy('houses.created_at', 'desc')->get();
    }

    public function showById(int $id): array
    {
        $house = $this->getById($id);
        $disk = Storage::disk($this->getDisk());

        return [
            'translations' => $house->translations,
            'type' => $house->type,
            'price' => $house->price,
            'discount' => $house->discount,
            'terrace_size' => $house->terrace_size,
            'plot_size' => $house->plot_size,
            'design' => $house->design ? [
                'name' => $house->design->name,
                'id' => $house->design->id
            ] : null,
            'floors' => $house->floors?->map(function ($floor) use ($disk) {
                return [
                    'id' => $floor->id,
                    'square_meter' => $floor->square_meter,
                    'model_image_path' => $floor->model_image ? $disk->url($floor->model_image, now()->addSeconds(360)) : null
                ];
            }),
            'id' => $house->id
        ];
    }

    public function getById(int $id): House
    {
        return House::query()->with(['translations', 'floors', 'design'])->findOrFail($id);
    }

    public function store(HouseInsertData $dto): void
    {
        DB::transaction(function () use ($dto) {
            $house = new House();
            $house->design_id = $dto->design_id;
            $house->type = $dto->type;
            $house->price = $dto->price;
            $house->terrace_size = $dto->terrace_size;
            $house->plot_size = $dto->plot_size;
            $house->save();
            if ($dto->images) {
                self::uploadAndStore($dto->images, 'houses', $house->id);
            }
            foreach ($dto->translations as $translation) {
                $this->storeTranslation($house, $translation);
            }
            foreach ($dto->floors as $key => $floor) {
                $this->storeFloor($key + 1, $house, $floor);
            }
        });
    }

    public function update(House $house, HouseUpdateData $dto): void
    {
        DB::transaction(function () use ($dto, $house) {
            $house->design_id = $dto->design_id;
            $house->type = $dto->type;
            $house->price = $dto->price;
            $house->terrace_size = $dto->terrace_size;
            $house->plot_size = $dto->plot_size;
            $house->save();
            $house->translations()->delete();
            foreach ($dto->translations as $translation) {
                $this->storeTranslation($house, $translation);
            }
            foreach ($dto->floors as $key => $floorDTO) {
                $floor = $house->floors->where('level', $key + 1)->first();
                $modelImage = $floor?->model_image;
                if($floorDTO->model_image) {
                    if($modelImage) {
                        self::deleteFile($floor->model_image);
                    }
                    $modelImage = self::upload($floorDTO->model_image, '/houses/' . $house->id . '/floors');
                }
                $data = [
                    'house_id' => $house->id,
                    'level' => $key + 1,
                    'square_meter' => $floorDTO->square_meter,
                ];
                if($modelImage) {
                    $data['model_image'] = $modelImage;
                }
                HouseFloor::query()->upsert($data, ['house_id','level']);
            }
        });
    }

    private function storeTranslation(House $house, HouseTranslationData $translation): void
    {
        $houseTranslation = new HouseTranslation();
        $houseTranslation->house_id = $house->id;
        $houseTranslation->key = $translation->key;
        $houseTranslation->locale = $translation->locale;
        $houseTranslation->value = $translation->value;
        $houseTranslation->save();
    }

    private function storeFloor(int $key, House $house, HouseFloorData $floor): void
    {
        $houseFloor = new HouseFloor();
        $houseFloor->level = $key;
        $houseFloor->house_id = $house->id;
        $houseFloor->square_meter = $floor->square_meter;
        $houseFloor->model_image = $floor->model_image ? self::upload($floor->model_image, 'houses/' . $house->id . '/floors') : null;
        $houseFloor->save();
    }
}
