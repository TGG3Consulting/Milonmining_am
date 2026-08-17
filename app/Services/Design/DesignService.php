<?php

namespace App\Services\Design;

use App\Models\Image;
use App\Services\Design\Data\DesignInsertData;
use App\Services\Design\Data\DesignUpdateData;
use App\Services\File\FileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class DesignService
{
    use FileService;
    public function __construct(
        private DesignRepository $repository
    )
    {
    }

    public function list(): Collection
    {
        return $this->repository->list();
    }

    public function getById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function store(DesignInsertData $dto): void
    {
        $this->repository->store($dto);
    }

    public function update(int $id, DesignUpdateData $dto): void
    {
        $this->repository->update($this->repository->getById($id), $dto);
    }

    public function deleteImage(int $id, int $imageId): void
    {
        $design = $this->repository->getById($id);
        self::deleteImageAndFile($design->images()->where('images.id', $imageId)->firstOrFail());
    }

    public function uploadImage(int $id, UploadedFile $file): Image
    {
        $design = $this->repository->getById($id);
        $path = self::upload($file, 'designs/' . $design->id);
        return self::storeFile('designs', $design->id, $path, $file);
    }
}
