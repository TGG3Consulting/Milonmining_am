<?php

namespace App\Services\CallCenter;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CallCenterService
{
    private string $base;
    private string $keyHeader;
    private string $keyValue;

    public function __construct()
    {
        $this->base      = rtrim(config('services.vivapbx.base_url'), '/');
        $this->keyHeader = (string) config('services.vivapbx.api_key_header', 'X-API-Key');
        $this->keyValue  = (string) config('services.vivapbx.api_key');
    }

    private function http()
    {
        return Http::timeout(20)
            ->acceptJson()
            ->withHeaders([$this->keyHeader => $this->keyValue]);
    }

    /** Make an outbound call: agent extension -> customer number */
    public function makeCall(string $fromExtension, string $toNumber, ?string $display = null): array
    {
        $endpoint = trim(config('services.vivapbx.endpoints.makecall', '/makecall'), '/');

        // Adjust field names if their doc uses e.g. src/dst instead of from_ext/to
        $payload  = array_filter([
            'user'     => $fromExtension,
            'phone'           => $toNumber,
            'display_name' => $display,
        ], fn($v) => $v !== null && $v !== '');

        return $this->http()
            ->post("{$this->base}/{$endpoint}", $payload)
            ->throw()
            ->json();
    }

    /** List recent calls (params per the doc: from, to, page, per/limit, etc.) */
    public function listCalls(array $params = []): array
    {
        $endpoint = trim(config('services.vivapbx.endpoints.calls', '/history/json'), '/');
        return $this->http()
            ->get("{$this->base}/{$endpoint}", $params)
            ->throw()
            ->json();
    }

    /** List PBX accounts/extensions (if exposed for your plan). */
    public function listAccounts(): array
    {
        $endpoint = trim(config('services.vivapbx.endpoints.accounts', '/users'), '/');
        return $this->http()
            ->get("{$this->base}/{$endpoint}")
            ->throw()
            ->json();
    }
}
