<?php

namespace App\Services\Client\House;

use App\Enum\LocaleEnum;
use App\Models\Design;
use App\Models\House;
use App\Models\HouseTranslation;
use App\Models\Image;
use App\Services\Client\House\Data\HouseListData;
use App\Services\File\FileService;
use App\Services\House\Enum\HouseStatusEnum;
use Illuminate\Support\Facades\Storage;

class HouseRepository
{
    use FileService;

    public function list(HouseListData $dto, LocaleEnum $locale)
    {
        $disk = Storage::disk($this->getDisk());

        return House::query()
            ->select([
                'houses.id',
                'houses.design_id',
                'houses.discount',
                'houses.price',
                'houses.status',
                'terrace_size',
                'plot_size',
                'translation.value as address'
            ])
            ->joinSub(
                HouseTranslation::query()->where('key', 'address')->where('locale', $locale),
                'translation',
                'translation.house_id',
                '=',
                'houses.id'
            )
            ->where('status', '!=', HouseStatusEnum::PENDING)
            ->when($dto->price_from, function ($query, $priceFrom) {
                $query->whereRaw('price - (COALESCE(discount, 0) * price / 100) >= '. $priceFrom);
            })
            ->when($dto->price_to, function ($query, $priceTo) {
                $query->whereRaw('price - (COALESCE(discount, 0) * price / 100) <= '. $priceTo);
            })
            ->when($dto->terrace_from, function ($query, $terraceFrom) {
                $query->where('terrace_size', '>=', $terraceFrom);
            })
            ->withSum('floors as total_sqm', 'square_meter')   // adds subselect alias total_sqm
            ->when($dto->square_from, function ($query, $squareFrom) {
                $query->having('total_sqm', '>=', $squareFrom);
            })
            ->whereIn('status', $dto->available
                ? [HouseStatusEnum::ACTIVE]
                : [HouseStatusEnum::SOLD, HouseStatusEnum::RESERVED])
            ->with(['floors', 'design'])
            ->get()
            ->map(function ($house) use ($locale, $disk) {
                return [
                    'id' => $house->id,
                    'address' => $house->address,
                    'discount' => $house->discount,
                    'price' => $house->price,
                    'discount_price' => $house->price - (($house->discount ?? 0) * $house->price / 100),
                    'status' => $house->status,
                    'terrace_size' => $house->terrace_size,
                    'plot_size' => $house->plot_size,
                    'square_meter' => $house->floors->sum('square_meter'),
                    'images' => $house->design->images?->map(function ($image) use ($disk) {
                        return $disk->url($image->path, now()->addSeconds(3600));
                    }),
                    'model_images' => $house->floors->map(function ($floor) use ($disk) {
                        return $disk->url($floor->model_image, now()->addSeconds(3600));
                    })
                ];
            });
    }

    public function townhouseSlides()
    {
        $disk = Storage::disk($this->getDisk());

        return Image::query()
            ->where('table', 'designs')
            ->joinSub(
                Design::query()->where('slug', 'thavounhavous'),
                'designs',
                'designs.id',
                '=',
                'images.relation_id'
            )
            ->get()
            ->map(function(Image $image) use($disk) {
                return $disk->url($image->path, now()->addSeconds(3600));
            });
    }
}
