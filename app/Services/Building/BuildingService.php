<?php

namespace App\Services\Building;

use App\Models\Image;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
use App\Services\Building\Data\BuildingInsertData;
use App\Services\Building\Data\BuildingUpdateData;
use App\Services\Building\Enum\BuildingStatusEnum;
use App\Services\File\FileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class BuildingService
{
    use FileService;

    public function __construct(
        private BuildingRepository $repository
    )
    {
    }

    public function list(): Collection
    {
        return $this->repository->list();
    }

    public function showById(int $id): array
    {
        return $this->repository->showById($id);
    }

    public function store(BuildingInsertData $dto): void
    {
        $this->repository->store($dto);
    }

    public function update(int $id, BuildingUpdateData $dto): void
    {
        $this->repository->update($id, $dto);
    }

    public function switcher(int $id, bool $active): void
    {
        $building = $this->repository->getById($id);
        if ($active) {
            if ($building->status === BuildingStatusEnum::PENDING) {
                if (!$building->apartments()->where('apartments.status', '!=', ApartmentStatusEnum::PENDING)->count()) {
                    throw new \InvalidArgumentException('Շենքը կարող եք ակտիվացնել՝ բնակարաններ ավելացնելուց հետո');
                }
            }
            $building->status = BuildingStatusEnum::ACTIVE;
            $building->save();
            return;
        }
        $building->status = BuildingStatusEnum::PENDING;
        $building->save();
    }

    public function deleteImage(int $id, int $imageId): void
    {
        $building = $this->repository->getById($id);
        self::deleteImageAndFile($building->images()->where('images.id', $imageId)->firstOrFail());
    }

    public function changeMainImage(int $id, int $imageId): void
    {
        $building = $this->repository->getById($id);
        $building->main_image_id = $imageId;
        $building->save();
    }

    public function uploadImage(int $id, UploadedFile $file): Image
    {
        $building = $this->repository->getById($id);
        $path = self::upload($file, 'buildings/' . $building->id);
        return self::storeFile('buildings', $building->id, $path, $file);
    }
}
