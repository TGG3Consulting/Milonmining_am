<?php

namespace App\Services\File;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait FileService
{
    public function upload(UploadedFile $file, string $dir): string
    {
        $disk = $this->getDisk();
        $name = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
        Storage::disk($disk)->putFileAs($dir, $file, $name);

        return $dir . '/' . $name;
    }

    public function uploadAndStore(array $files, string $table, int $relationId): void
    {
        /** @var UploadedFile $file */
        foreach ($files as $file) {
            $path = $this->upload($file, $table . '/' . $relationId);
            $this->storeFile($table, $relationId, $path, $file);
        }
    }

    public function storeFile(string $table, int $relationId, string $path, UploadedFile $file): Image
    {
        $image = new Image();
        $image->table = $table;
        $image->relation_id = $relationId;
        $image->path = $path;
        $image->extension = $file->getClientOriginalExtension();
        $image->save();
        return $image;
    }

    public function getDisk(): string
    {
        return 'public';
        if (App::environment() === 'public') {
        }
        return 'minio';
    }

    public function deleteImageAndFile(Image $image): void
    {
        $this->deleteFile($image->path);
        $image->delete();
    }

    public function deleteFile(string $path)
    {
        Storage::disk($this->getDisk())->delete($path);
    }
}
