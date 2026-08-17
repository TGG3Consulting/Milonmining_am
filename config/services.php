<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'vivapbx' => [
        'base_url' => env('VIVAPBX_BASE_URL'),

        // static key auth
        'api_key'        => env('VIVAPBX_API_KEY'),
        'api_key_header' => env('VIVAPBX_API_KEY_HEADER', 'X-API-Key'),

        // token auth (leave endpoint empty to disable)
        'auth' => [
            'endpoint'     => env('VIVAPBX_AUTH_ENDPOINT', ''),
            'username'     => env('VIVAPBX_AUTH_USERNAME'),
            'password'     => env('VIVAPBX_AUTH_PASSWORD'),
            'token_header' => env('VIVAPBX_AUTH_TOKEN_HEADER', 'Authorization'),
            'token_prefix' => env('VIVAPBX_AUTH_TOKEN_PREFIX', 'Bearer'),
            'ttl'          => env('VIVAPBX_AUTH_TOKEN_TTL', 3600),
        ],

        'endpoints' => [
            'makecall' => env('VIVAPBX_ENDPOINT_MAKECALL', '/makecall'),
            'calls'    => env('VIVAPBX_ENDPOINT_CALLS', '/history/json'),
            'accounts' => env('VIVAPBX_ENDPOINT_ACCOUNTS', '/users'),
        ],
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
