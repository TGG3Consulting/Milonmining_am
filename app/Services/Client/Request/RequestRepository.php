<?php

namespace App\Services\Client\Request;

use App\Enum\LocaleEnum;
use App\Models\RequestModel;
use App\Services\Client\Request\Data\RequestInsertData;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use Illuminate\Support\Facades\Hash;

class RequestRepository
{
    public function store(RequestBlockEnum $block, RequestInsertData $dto, LocaleEnum $locale): RequestModel
    {
        if (!$request = $this->checkBeforeStore($block, $dto)) {
            $request = new RequestModel();
            $request->block = $block;
            $request->type = $dto->type;
            $request->relation_id = $dto->relation_id;
            $request->locale = $locale;
            $request->name = $dto->name;
            $request->phone = $dto->phone;
            $request->hash = Hash::make($dto->phone . $locale->value . $dto->name . $dto->relation_id . $block->value);
            $request->save();
        }
        return $request;
    }

    private function checkBeforeStore(RequestBlockEnum $block, RequestInsertData $dto): ?RequestModel
    {
        return RequestModel::query()
            ->where('block', $block)
            ->where('relation_id', $dto->relation_id)
            ->where('phone', $dto->phone)
            ->first();
    }

    public function getById(int $id): RequestModel
    {
        return RequestModel::query()->findOrFail($id);
    }
}
