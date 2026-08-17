<?php

namespace App\Services\Page\Data;

use Spatie\LaravelData\Data;

final class PageReorderData extends Data
{
    public function __construct(public array $items) {}

    public static function rules(): array
    {
        return [
            'items'             => ['required','array'],
            'items.*.id'        => ['required','integer','exists:pages,id'],
            'items.*.parent_id' => ['nullable','integer','exists:pages,id'],
            'items.*.sort'      => ['required','integer','min:0'],
        ];
    }
}

