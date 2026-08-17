<?php

namespace App\Models;

use App\Services\Building\Enum\BuildingStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{
    protected $casts = [
        'status' => BuildingStatusEnum::class,
        'translation_array' => 'array'
    ];

    public array $translationKeys = [
        'address',
        'name'
    ];

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'relation_id', 'id')->where('table', 'buildings');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class, 'relation_id', 'id')
            ->select([
                'translations.id',
                'translations.relation_id',
                'translations.value',
                'translations.locale',
                'translations.key_id',
                'keys.key'
            ])
            ->joinSub(
                TranslationKey::query(),
                'keys',
                'keys.id',
                '=',
                'translations.key_id'
            )
            ->where('table_name', 'buildings');
    }

    public function apartments(): HasMany
    {
        return $this->hasMany(Apartment::class);
    }

    public function main_image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function garages(): HasMany
    {
        return $this->hasMany(BuildingGarage::class, 'building_id');
    }
}
