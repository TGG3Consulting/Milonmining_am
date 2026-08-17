<?php

namespace App\Services\Request\Data;

use App\Services\Client\Request\Enum\RequestBlockEnum;
use Spatie\LaravelData\Data;

final class RequestListData extends Data
{
    public function __construct(
        public int $limit,
        public int $timezone,
        public ?int $offset = 0,
        public ?int $building_id = null,
        public ?int $number = null,
        public ?string $status = null,
        public ?float $square_meter = null,
        public ?string $search = null,
        public ?RequestBlockEnum $block = null,
    )
    {
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getOffset(): ?int
    {
        return $this->offset;
    }

    public function getSearch(): ?string
    {
        return $this->search;
    }

}
