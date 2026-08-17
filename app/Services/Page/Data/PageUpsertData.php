<?php

namespace App\Services\Page\Data;

use Spatie\LaravelData\Data;

final class PageUpsertData extends Data
{
    /** @param string[]|null $permissions */
    public function __construct(
        public string  $key,
        public string  $label,
        public string  $path,
        public ?string $icon = null,
        public ?array  $permissions = null,
        public ?int    $parent_id = null,
        public int     $sort = 0,
        public bool    $is_active = true,
    )
    {
    }

    public static function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:100'],
            'label' => ['required', 'string', 'max:100'],
            'path' => ['required', 'string', 'max:200'],
            'icon' => ['nullable', 'string', 'max:120'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string'],
            'parent_id' => ['nullable', 'integer', 'exists:pages,id'],
            'sort' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
