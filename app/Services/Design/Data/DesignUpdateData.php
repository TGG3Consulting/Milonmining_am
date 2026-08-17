<?php

namespace App\Services\Design\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

final class DesignUpdateData extends Data
{
    public function __construct(
        public string $name,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'name' => 'required|string',
        ];
    }
}
