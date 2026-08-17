<?php

namespace App\Services\Page;

use App\Models\Page;
use App\Services\Page\Data\PageReorderData;
use App\Services\Page\Data\PageUpsertData;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;

class PageRepository
{
    public function list(string $search = null): Collection
    {
        $query = Page::query()->orderBy('parent_id')->orderBy('sort')->orderBy('id');
        if ($search) {
            $query->where(fn($w) => $w
                ->where('label', 'like', "%$search%")
                ->orWhere('key', 'like', "%$search%")
                ->orWhere('path', 'like', "%$search%"));
        }
        return $query->get();
    }

    public function getByKey(string $key): ?Page
    {
        return Page::query()->where('key', $key)->first();
    }

    public function getById(int $id): ?Page
    {
        return Page::query()->findOrFail($id);
    }

    public function store(PageUpsertData $dto): Page
    {
        return Page::query()->create($dto->toArray());
    }

    public function update(Page $page, PageUpsertData $dto): Page
    {
        $page->update($dto->toArray());
        return $page->fresh();
    }

    public function reorder(PageReorderData $dto): void
    {
        foreach ($dto->items as $row) {
            Page::query()->whereKey($row['id'])->update([
                'parent_id' => $row['parent_id'] ?? null,
                'sort' => $row['sort'],
            ]);
        }
    }
}
