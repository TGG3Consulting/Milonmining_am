<?php

namespace App\Services\Translation;

class TranslationService
{
    public function __construct(
        private TranslationRepository $repository
    )
    {
    }

    public function getKeys(string $table)
    {
        return $this->repository->getKeys($table);
    }
}
