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
                // Armenia and Russia are the two the site offers as a choice, but a
                // buyer can be reached on any country's number, so accept E.164:
                // a plus and 7 to 15 digits. The site still checks +374 and +7
                // strictly, this only widens what else may come through.
                'regex:/^\+[1-9]\d{6,14}$/'
            ],
            'relation_id' => ['required', 'integer', 'gt:0'],
            'type' => ['nullable', new Enum(RequestTypeEnum::class)]
        ];
    }
}
