<?php

namespace App\Http\Controllers\Client;

use App\Enum\LocaleEnum;
use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Services\Client\Bitrix\BitrixCrmService;
use App\Services\Client\Building\BuildingService;
use App\Services\Client\Request\Data\FeedbackInsertData;
use App\Services\Client\Request\Data\RequestInsertData;
use App\Services\Client\Request\Enum\RequestBlockEnum;
use App\Services\Client\Request\RequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RequestController extends Controller
{
    public function __construct(
        private RequestService  $service,
        private BuildingService $buildingService,
        private BitrixCrmService $bitrix
    )
    {
    }

    public function store(string $block, Request $request): JsonResponse
    {
        $dto = RequestInsertData::from($request);
        $block = RequestBlockEnum::from($block);
        $request = $this->service->store($block, $dto, $this->resolveLocale($request));

        // Our own row is written by now. The two Bitrix calls take about five
        // seconds between them, which is far too long to keep somebody staring
        // at a spinner, so they run after the response has gone out. A CRM
        // outage is logged and swallowed, never shown as a failed form.
        [$firstName, $lastName] = $this->splitName($dto->first_name, $dto->last_name, $dto->name);
        $apartmentNumber = $block === RequestBlockEnum::APARTMENTS
            ? Apartment::query()->whereKey($dto->relation_id)->value('number')
            : null;

        defer(fn () => $this->bitrix->createBooking(
            $firstName,
            $lastName,
            $dto->phone,
            $dto->relation_id,
            $dto->preferred_contact_method,
            $apartmentNumber
        ));

        if ($block === RequestBlockEnum::APARTMENTS) {
            return $this->created([
                'garage_availability' => $this->buildingService->getGaragesAvailability($dto->relation_id),
                'request_id' => $request->id,
                'session' => $request->hash
            ]);
        }
        return $this->created([
            'garage_availability' => false
        ]);
    }

    /**
     * The feedback form. No apartment, so it becomes a Lead rather than a Deal.
     */
    public function contact(Request $request): JsonResponse
    {
        $dto = FeedbackInsertData::from($request);

        // Same reasoning as the booking: answer first, talk to Bitrix after.
        defer(fn () => $this->bitrix->createLead(
            $dto->first_name,
            $dto->last_name,
            $dto->phone,
            $dto->preferred_contact_method
        ));

        return $this->created(null, 'Created');
    }

    public function want_garage(Request $request, int $requestId): JsonResponse
    {
        $this->service->want_garage($requestId, $request->get('session'));
        return $this->success();
    }

    /**
     * Older callers send only the joined name; split it on the first space so
     * Bitrix still gets two fields rather than one.
     *
     * @return array{0: string, 1: string}
     */
    private function splitName(?string $first, ?string $last, string $joined): array
    {
        $first = trim((string) $first);
        $last = trim((string) $last);

        if ($first !== '' || $last !== '') {
            return [$first, $last];
        }

        $parts = preg_split('/\s+/u', trim($joined), 2) ?: [];

        return [$parts[0] ?? '', $parts[1] ?? ''];
    }
}
