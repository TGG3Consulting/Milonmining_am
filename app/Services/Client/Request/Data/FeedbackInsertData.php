<?php

namespace App\Services\Client\Request\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

/**
 * The feedback form, the one with no apartment attached. It becomes a Lead in
 * Bitrix rather than a Deal, so it carries no relation_id.
 */
final class FeedbackInsertData extends Data
{
    public function __construct(
        public string $first_name,
        public string $last_name,
        public string $phone,
        public ?string $preferred_contact_method = null,
    )
    {
    }

    public static function rules(?ValidationContext $context = null): array
    {
        return [
            'first_name' => ['required', 'string', 'min:2', 'max:100'],
            'last_name' => ['required', 'string', 'min:2', 'max:100'],
            // same shape the reserve endpoint accepts: a plus and 7 to 15 digits
            'phone' => ['required', 'regex:/^\+[1-9]\d{6,14}$/'],
            'preferred_contact_method' => ['nullable', 'in:call,whatsapp,viber,telegram'],
        ];
    }
}
