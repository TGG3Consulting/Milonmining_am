<?php

namespace App\Services\Client\Request\Data;

use App\Enum\LocaleEnum;
use App\Services\Client\Request\Enum\RequestTypeEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class RequestInsertData extends Data
{
    public function __construct(
        public string     $name,
        public string     $phone,
        public int     $relation_id,
        public RequestTypeEnum $type = RequestTypeEnum::RESERVE
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'name' => ['required', 'string', 'min:3'],
            'phone' => [
                'required',
                'regex:/^(\+374\d{8}|\+7\d{10})$/'
            ],
            'relation_id' => ['required', 'integer', 'gt:0'],
            'type' => ['nullable', new Enum(RequestTypeEnum::class)]
        ];
    }
}
