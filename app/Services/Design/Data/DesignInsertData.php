<?php

namespace App\Services\Design\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

final class DesignInsertData extends Data
{
    public function __construct(
        public string $name,
        /** @var UploadedFile[] */
        public array  $images
    )
    {
    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string',
            'images' => 'required|array',
            'images.*' => ['required','file','image','mimes:jpg,jpeg,png,webp','max:5120'],
        ];
    }
}
