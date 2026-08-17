<?php

namespace App\Services\Page;

use App\Models\Page;
use App\Services\Page\Data\PageReorderData;
use App\Services\Page\Data\PageUpsertData;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PageService
{
    public function __construct(
        private PageRepository $repository
    )
    {
    }

    public function list(string $search = null): Collection
    {
        return $this->repository->list($search);
    }

    public function store(PageUpsertData $dto): Page
    {
        if ($this->repository->getByKey($dto->key)) {
            throw new \InvalidArgumentException('key already exists');
        }
        return $this->repository->store($dto);
    }

    public function update(int $id, PageUpsertData $dto): Page
    {
        $page = $this->repository->getById($id);
        if ($dto->key !== $page->key) {
            if ($this->repository->getByKey($dto->key)) {
                throw new \InvalidArgumentException('key already exists');
            }
        }
        return $this->repository->update($page, $dto);
    }

    public function destroy(int $id): void
    {
        $page = $this->repository->getById($id);
        $page->delete();
    }

    public function reorder(PageReorderData $dto): void
    {
        $this->repository->reorder($dto);
    }

    public function tree(Request $request): array
    {
        $user = $request->user();
        $abilities = $user->getAllPermissions()->pluck('name')->toArray();
        $isSuper = $user->hasRole('super-admin');

        $all = $this->repository->list();

        $allowed = array_values(array_filter($all->toArray(), function ($item) use ($abilities, $isSuper) {
            $req = $item['permissions'] ?? null;
            if ($isSuper || empty($req)) return true;
            return (bool) array_intersect($req, $abilities);
        }));

        // build tree
        $byId = [];
        foreach ($allowed as $row) {
            $row['children'] = [];
            $byId[$row['id']] = $row;
        }
        $tree = [];
        foreach ($byId as $id => $row) {
            $pid = $row['parent_id'];
            if ($pid && isset($byId[$pid])) {
                $tree[$pid]['children'][] = $row;
            } else {
                $tree[$id] = $row;
            }
        }
        return array_values($tree);
    }
}
