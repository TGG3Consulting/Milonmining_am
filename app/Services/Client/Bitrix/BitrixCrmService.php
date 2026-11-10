<?php

namespace App\Services\Client\Bitrix;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Pushes the two website forms into Bitrix24.
 *
 *   feedback form  -> a Lead
 *   booking form   -> a Contact, plus a Deal parked on "Կայքից ամրագրում"
 *                     in the Վաճառք funnel, with the contact attached
 *
 * Nothing in here may break a submission. By the time these run the visitor's
 * request is already stored in our own database, so a CRM outage has to be
 * logged and swallowed rather than shown to them as a failed form.
 */
final class BitrixCrmService
{
    /** crm_status STATUS_ID values, not the numeric row ids shown in the admin */
    private const SOURCE_FEEDBACK = 'UC_ARH9ZX';    // Կայքից հետադարձ կապի հայտ
    private const SOURCE_BOOKING  = 'UC_3SM87Y';    // Ամրագրում կայքից

    private const DEAL_CATEGORY = 5;                // Վաճառք
    private const DEAL_STAGE    = 'C5:UC_UX02IR';   // Կայքից ամրագրում

    private const LEAD_CONTACT_METHOD_FIELD = 'UF_CRM_1794233125233';
    private const DEAL_CONTACT_METHOD_FIELD = 'UF_CRM_1794296225367';
    private const DEAL_APARTMENT_ID_FIELD   = 'UF_CRM_1776278278898';

    /** The same four choices are separate enumerations on each entity. */
    private const LEAD_CONTACT_METHOD = [
        'call' => 1669, 'whatsapp' => 1671, 'viber' => 1673, 'telegram' => 1675,
    ];
    private const DEAL_CONTACT_METHOD = [
        'call' => 1677, 'whatsapp' => 1679, 'viber' => 1681, 'telegram' => 1683,
    ];

    public function enabled(): bool
    {
        return (bool) config('services.bitrix.webhook');
    }

    /**
     * The feedback form. Returns the new lead id, or null if it did not land.
     */
    public function createLead(
        string $firstName,
        string $lastName,
        string $phone,
        ?string $contactMethod = null
    ): ?int {
        $fields = [
            'TITLE'      => $this->title('Հետադարձ կապ', $firstName, $lastName),
            'NAME'       => $firstName,
            'LAST_NAME'  => $lastName,
            'PHONE'      => [['VALUE' => $phone, 'VALUE_TYPE' => 'MOBILE']],
            'SOURCE_ID'  => self::SOURCE_FEEDBACK,
            'OPENED'     => 'Y',
        ];

        if ($id = self::LEAD_CONTACT_METHOD[$contactMethod] ?? null) {
            $fields[self::LEAD_CONTACT_METHOD_FIELD] = $id;
        }

        return $this->idFrom($this->call('crm.lead.add', ['fields' => $fields]));
    }

    /**
     * The booking form: a contact first, then the deal it belongs to.
     *
     * @return array{contact_id: ?int, deal_id: ?int}
     */
    public function createBooking(
        string $firstName,
        string $lastName,
        string $phone,
        ?int $apartmentId = null,
        ?string $contactMethod = null,
        ?string $apartmentNumber = null
    ): array {
        $contactId = $this->idFrom($this->call('crm.contact.add', [
            'fields' => [
                'NAME'      => $firstName,
                'LAST_NAME' => $lastName,
                'PHONE'     => [['VALUE' => $phone, 'VALUE_TYPE' => 'MOBILE']],
                'SOURCE_ID' => self::SOURCE_BOOKING,
                'OPENED'    => 'Y',
            ],
        ]));

        $subject = $apartmentNumber !== null && $apartmentNumber !== ''
            ? 'Ամրագրում · բն. ' . $apartmentNumber
            : 'Ամրագրում կայքից';

        $fields = [
            'TITLE'       => $this->title($subject, $firstName, $lastName),
            'CATEGORY_ID' => self::DEAL_CATEGORY,
            'STAGE_ID'    => self::DEAL_STAGE,
            'SOURCE_ID'   => self::SOURCE_BOOKING,
            'OPENED'      => 'Y',
        ];

        if ($contactId !== null) {
            $fields['CONTACT_ID'] = $contactId;
        }
        if ($apartmentId !== null) {
            // The apartment's row id in our database, so the two sides line up.
            //
            // Bitrix currently refuses to store this one: tested on add and on
            // update, as int, float and string, with a webhook that holds the
            // full crm scope, while the enumeration field right next to it
            // saves without trouble. Something on the Bitrix side owns it. The
            // write stays here so it starts working the moment that is lifted,
            // and the id also goes into the comment so the sales team can read
            // it either way.
            $fields[self::DEAL_APARTMENT_ID_FIELD] = $apartmentId;

            $fields['COMMENTS'] = $apartmentNumber !== null && $apartmentNumber !== ''
                ? sprintf('Բնակարան № %s · կայքի id %d', $apartmentNumber, $apartmentId)
                : sprintf('Կայքի id %d', $apartmentId);
        }
        if ($id = self::DEAL_CONTACT_METHOD[$contactMethod] ?? null) {
            $fields[self::DEAL_CONTACT_METHOD_FIELD] = $id;
        }

        return [
            'contact_id' => $contactId,
            'deal_id'    => $this->idFrom($this->call('crm.deal.add', ['fields' => $fields])),
        ];
    }

    private function title(string $subject, string $firstName, string $lastName): string
    {
        $who = trim($firstName . ' ' . $lastName);

        return $who === '' ? $subject : $subject . ' — ' . $who;
    }

    private function idFrom(?array $response): ?int
    {
        $result = $response['result'] ?? null;

        return is_numeric($result) ? (int) $result : null;
    }

    /**
     * milonmining24.bitrix24.ru resolves to a dozen addresses and several of
     * them refuse to accept a connection from this server: about a third of
     * attempts hang at the TCP stage while the rest answer in under a second.
     * cURL picks an address per attempt, so the cure is to give up on a dead
     * one quickly and try again, which lands on a different address.
     *
     * Only a failure to establish the connection is repeated. If the socket
     * opened, Bitrix may well have carried out the request before we gave up,
     * and repeating it would duplicate a contact, a deal or a lead. That case
     * is told apart by how long the attempt lasted.
     */
    private const ATTEMPTS = 3;
    private const CONNECT_TIMEOUT = 5;

    private function call(string $method, array $payload): ?array
    {
        $webhook = config('services.bitrix.webhook');

        if (!$webhook) {
            return null;
        }

        $url = rtrim($webhook, '/') . '/' . $method . '.json';
        $timeout = (int) config('services.bitrix.timeout', 20);

        for ($attempt = 1; $attempt <= self::ATTEMPTS; $attempt++) {
            $startedAt = microtime(true);

            try {
                $response = Http::connectTimeout(self::CONNECT_TIMEOUT)
                    ->timeout($timeout)
                    ->acceptJson()
                    ->asJson()
                    ->post($url, $payload);

                $body = $response->json();

                if (!$response->successful() || isset($body['error'])) {
                    Log::warning('Bitrix CRM call failed', [
                        'method' => $method,
                        'status' => $response->status(),
                        'error'  => $body['error'] ?? null,
                        'detail' => $body['error_description'] ?? null,
                    ]);

                    return null;
                }

                if ($attempt > 1) {
                    Log::info('Bitrix CRM call succeeded on a retry', [
                        'method'  => $method,
                        'attempt' => $attempt,
                    ]);
                }

                return $body;
            } catch (Throwable $e) {
                $elapsed = microtime(true) - $startedAt;
                $neverConnected = $e instanceof ConnectionException
                    && $elapsed < self::CONNECT_TIMEOUT + 1;

                if ($neverConnected && $attempt < self::ATTEMPTS) {
                    continue;
                }

                Log::warning('Bitrix CRM call threw', [
                    'method'   => $method,
                    'attempt'  => $attempt,
                    'elapsed'  => round($elapsed, 1),
                    'retried'  => $neverConnected,
                    'message'  => $e->getMessage(),
                ]);

                return null;
            }
        }

        return null;
    }
}
