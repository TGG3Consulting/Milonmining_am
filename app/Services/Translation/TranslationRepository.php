<?php

namespace App\Services\Translation;

use App\Models\TranslationKey;
use Illuminate\Support\Collection;

class TranslationRepository
{
    public function getKeys(string $table): Collection
    {
        return TranslationKey::query()->where('table_name', $table)->get();
    }
}
