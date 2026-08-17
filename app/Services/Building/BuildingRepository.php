<?php

namespace App\Services\Building;

use App\Enum\LocaleEnum;
use App\Models\Block;
use App\Models\Building;
use App\Models\Floor;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Services\Building\Data\BuildingTranslationData;
use App\Services\Building\Data\BuildingInsertData;
use App\Services\Building\Data\BuildingUpdateData;
use App\Services\Building\Enum\BuildingStatusEnum;
use App\Services\File\FileService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BuildingRepository
{
    use FileService;

    public function list(LocaleEnum $locale = LocaleEnum::AM): Collection
    {
        return Building::query()
            ->select([
                'buildings.id',
                'buildings.start_date',
                'buildings.end_date',
                DB::raw("CASE WHEN status = 'active' THEN true ELSE false END as active")
            ])
            ->selectSub(function ($q) use ($locale) {
                // inner: build ordered JSON objects
                $inner = DB::table('translations')
                    ->selectRaw("JSON_OBJECT('key', `key`, 'value', `value`) AS obj")
                    ->joinSub(
                        TranslationKey::query(),
                        'keys',
                        'keys.id',
                        '=',
                        'key_id'
                    )
                    ->where('locale', $locale)
                    ->where('table_name', 'buildings')
                    ->whereColumn('relation_id', 'buildings.id');

                // outer: aggregate to JSON array (no ORDER BY inside aggregate)
                $q->fromSub($inner, 't')
                    ->selectRaw("JSON_ARRAYAGG(t.obj)");
            }, 'translation_array')
            ->with(['floors'])
            ->get()
            ->map(function(Building $building) {
                $row = [
                    'id' => $building->id,
                    'start_date' => $building->start_date,
                    'end_date' => $building->end_date,
                    'active' => $building->active,
                    'translation_array' => $building->translation_array,
                    'floors_qty' => $building->floors->count(),
                ];
                foreach($building->translations as $translation) {
                    $row[$translation->key] = $translation->value;
                }
                return $row;
            });
    }

    public function showById(int $id)
    {
        $building = $this->getById($id);
        if ($building->status !== BuildingStatusEnum::PENDING) {
            throw new \InvalidArgumentException('building_needs_to_be_in_pending_status');
        }
        $disk = Storage::disk($this->getDisk());

        return [
            'id' => $id,
            'status' => $building->status,
            'start_date' => $building->start_date,
            'end_date' => $building->end_date,
            'translations' => $building->translations,
            'entries' => $building->blocks,
            'images' => $building->images?->map(function ($image) use ($disk) {
                return [
                    'id' => $image->id,
                    'path' => $disk->url($image->path, now()->addSeconds(360)),
                ];
            }),
            'floors' => $building->floors?->map(function ($floor) use ($disk) {
                return [
                    'id' => $floor->id,
                    'level' => $floor->level,
                    'price' => $floor->price,
                    'type' => $floor->type,
                    'model_image_path' => $floor->model_image ? $disk->url($floor->model_image, now()->addSeconds(360)) : null
                ];
            })
        ];
    }

    public function getById(int $id): Building
    {
        return Building::query()->with(['translations', 'blocks', 'floors'])->findOrFail($id);
    }

    public function store(BuildingInsertData $dto): void
    {
        DB::transaction(function () use ($dto) {
            $building = new Building();
            $building->status = BuildingStatusEnum::PENDING;
            $building->start_date = $dto->start_date;
            $building->end_date = $dto->end_date;
            $building->save();
            self::uploadAndStore($dto->images, 'buildings', $building->id);
            foreach ($dto->translations as $translationDTO) {
                $this->storeTranslation($building, $translationDTO);
            }
            foreach ($dto->blocks as $blockName) {
                $this->storeBlocks($building, $blockName);
            }
            foreach ($dto->floors as $key => $floorDTO) {
                $modelImage = null;
                if($floorDTO->model_image) {
                    $modelImage = self::upload($floorDTO->model_image, '/buildings/floors/' . $building->id . '/models');
                }
                $floor = new Floor();
                $floor->type = $floorDTO->type;
                $floor->building_id = $building->id;
                $floor->price = $floorDTO->price;
                $floor->level = $floorDTO->level;
                $floor->model_image = $modelImage;
                $floor->save();
            }
        });
    }

    public function update(int $id, BuildingUpdateData $dto): void
    {
        $building = $this->getById($id);
        $building->start_date = $dto->start_date;
        $building->end_date = $dto->end_date;
        $building->save();
        $building->translations()->delete();
        foreach ($dto->translations as $translationDTO) {
            $this->storeTranslation($building, $translationDTO);
        }
//        $building->blocks()->delete();
//        foreach ($dto->blocks as $blockName) {
//            $this->storeBlocks($building, $blockName);
//        }
        foreach ($dto->floors as $key => $floorDTO) {
            $floor = $building->floors->where('level', $key + 1)->first();
            $modelImage = $floor?->model_image;
            if($floorDTO->model_image) {
                if($modelImage) {
                    self::deleteFile($modelImage);
                }
                $modelImage = self::upload($floorDTO->model_image, '/buildings/floors/' . $building->id . '/models');
            }
            $data = [
                'type' => $floorDTO->type,
                'building_id' => $building->id,
                'level' => $floorDTO->level,
//                'price' => $floorDTO->price,
            ];
            if($modelImage) {
                $data['model_image'] = $modelImage;
            }
            Floor::query()->upsert($data, ['building_id','level']);
        }
    }

    private function storeTranslation(Building $building, BuildingTranslationData $translationDTO): Translation
    {
        $translation = new Translation();
        $translation->relation_id = $building->id;
        $translation->key_id = $translationDTO->key_id;
        $translation->locale = $translationDTO->locale;
        $translation->value = $translationDTO->value;
        $translation->save();
        return $translation;
    }

    private function storeBlocks(Building $building, string $name): Block
    {
        $block = new Block();
        $block->building_id = $building->id;
        $block->name = $name;
        $block->save();
        return $block;
    }
}
