<?php

namespace App\Services\Design;

use App\Models\Design;
use App\Services\Design\Data\DesignInsertData;
use App\Services\Design\Data\DesignUpdateData;
use App\Services\File\FileService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DesignRepository
{
    use FileService;

    public function list(): Collection
    {
        return Design::query()->orderBy('created_at', 'desc')->get();
    }

    public function showById(int $id): array
    {
        $design = $this->getById($id);
        $disk = Storage::disk($this->getDisk());
        return [
            'name' => $design->name,
            'images' => $design->images?->map(function ($image) use ($disk) {
                return [
                    'id' => $image->id,
                    'path' => $disk->url($image->path, now()->addSeconds(360)),
                ];
            })
        ];
    }

    public function getById(int $id): Design
    {
        return Design::query()->with(['images'])->findOrFail($id);
    }

    public function store(DesignInsertData $dto): void
    {
        DB::transaction(function () use ($dto) {
            $design = new Design();
            $design->name = $dto->name;
            $design->slug = Str::slug($dto->name);
            $design->save();
            self::uploadAndStore($dto->images, 'designs', $design->id);
        });
    }

    public function update(Design $design, DesignUpdateData $dto): void
    {
        DB::transaction(function () use ($dto, $design) {
            $design->name = $dto->name;
            $design->slug = Str::slug($dto->name);
            $design->save();
        });
    }
}
