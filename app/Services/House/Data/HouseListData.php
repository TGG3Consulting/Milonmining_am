<?php

namespace App\Services\House\Data;

use App\Services\House\Enum\HouseStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Data;

final class HouseListData extends Data
{
    public function __construct(
        public ?HouseStatusEnum $status = null
    )
    {
    }

    public static function rules(): array
    {
        return [
            'status' => [new Enum(HouseStatusEnum::class)],
        ];
    }
}
