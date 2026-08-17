<?php

namespace App\Services\Client\Request;

use App\Enum\LocaleEnum;
use App\Models\RequestModel;
use App\Services\Client\Request\Data\RequestInsertData;
use App\Services\Client\Request\Enum\RequestBlockEnum;

class RequestService
{
    public function __construct(
        private RequestRepository $repository
    )
    {
    }

    public function store(RequestBlockEnum $block, RequestInsertData $dto, LocaleEnum $locale): RequestModel
    {
        return $this->repository->store($block, $dto, $locale);
    }

    public function want_garage(int $requestId, string $hash): void
    {
        $request = $this->repository->getById($requestId);
        if($request->hash === $hash) {
            $request->want_garage = true;
            $request->hash = null;
            $request->save();
        }
    }
}
