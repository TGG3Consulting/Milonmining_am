<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'csrf-cookie', 'login', 'logout', 'buildings','apartments', 'apartments/*', 'houses', 'reserve/houses', 'reserve/*', 'reserve/apartments', 'houses/townhouses/slides'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    // if you use Sanctum or cookies, turn on credentials:
    'supports_credentials' => true,
];
