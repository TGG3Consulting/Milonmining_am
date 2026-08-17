<?php

namespace App\Services\Request\Data;

use App\Services\Client\Request\Enum\RequestBlockEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

final class RequestSingleInsertData extends Data
{
    public function __construct(
        public RequestBlockEnum $block,
        public string           $name,
        public string           $phone_number,
        public int              $relation_id,
        public ?int             $garage_relation_id = null,
        public ?float           $preferred_price = null,
        public ?string          $comments = null,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'block' => ['required', new Enum(RequestBlockEnum::class)],
            'name' => ['required', 'string', 'min:3'],
            'preferred_price' => ['nullable', 'numeric'],
            'phone_number' => [
                'required',
                'regex:/^(\+374\d{8}|\+7\d{10})$/'
            ],
            'relation_id' => ['required', 'integer', 'gt:0'],
            'garage_relation_id' => ['nullable', 'integer', 'gt:0'],
            'comments' => ['nullable', 'string'],
        ];
    }
}
