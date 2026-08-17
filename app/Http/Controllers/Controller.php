<?php

namespace App\Http\Controllers;


use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller as BaseController;
use Symfony\Component\HttpFoundation\Response as Http;

abstract class Controller
{
    /**
     * Unified JSON shape.
     *
     * {
     *   ok: bool,
     *   message?: string,
     *   data?: mixed,
     *   errors?: mixed,
     *   meta?: array
     * }
     */
    protected function respond(
        bool $ok,
        mixed $data = null,
        ?string $message = null,
        mixed $errors = null,
        array $meta = [],
        int $status = Http::HTTP_OK
    ): JsonResponse {
        $payload = ['ok' => $ok];

        if (!is_null($message)) $payload['message'] = $message;
        if (!is_null($data))    $payload['data']    = $data;
        if (!is_null($errors))  $payload['errors']  = $errors;
        if (!empty($meta))      $payload['meta']    = $meta;

        return response()->json($payload, $status);
    }

    /* ------------ Success helpers ------------ */

    public function success(
        mixed $data = null,
        string $message = 'OK',
        array $meta = [],
        int $status = Http::HTTP_OK
    ): JsonResponse {
        return $this->respond(true, $data, $message, null, $meta, $status);
    }

    public function created(
        mixed $data = null,
        string $message = 'Created'
    ): JsonResponse {
        return $this->respond(true, $data, $message, null, [], Http::HTTP_CREATED);
    }

    public function noContent(): JsonResponse
    {
        // 204 must not include a body
        return response()->json(null, Http::HTTP_NO_CONTENT);
    }

    /**
     * Paginator to standard shape:
     * data -> items; meta -> pagination info
     */
    public function paginated(
        LengthAwarePaginator|AbstractPaginator $paginator,
        string $message = 'OK',
        array $extraMeta = []
    ): JsonResponse {
        $meta = array_merge([
            'current_page' => method_exists($paginator, 'currentPage') ? $paginator->currentPage() : null,
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator instanceof LengthAwarePaginator ? $paginator->total() : null,
            'last_page'    => $paginator instanceof LengthAwarePaginator ? $paginator->lastPage() : null,
            'from'         => $paginator->firstItem(),
            'to'           => $paginator->lastItem(),
            'links'        => [
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ], $extraMeta);

        return $this->success($paginator->items(), $message, $meta);
    }

    /* ------------ Error helpers ------------ */

    public function error(
        string $message = 'Error',
        int $status = Http::HTTP_BAD_REQUEST,
        mixed $errors = null,
        array $meta = []
    ): JsonResponse {
        return $this->respond(false, null, $message, $errors, $meta, $status);
    }

    public function validationError(
        mixed $errors,
        string $message = 'The given data was invalid.'
    ): JsonResponse {
        return $this->error($message, Http::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }

    public function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->error($message, Http::HTTP_UNAUTHORIZED);
    }

    public function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return $this->error($message, Http::HTTP_FORBIDDEN);
    }

    public function notFound(string $message = 'Not Found'): JsonResponse
    {
        return $this->error($message, Http::HTTP_NOT_FOUND);
    }

    public function conflict(string $message = 'Conflict'): JsonResponse
    {
        return $this->error($message, Http::HTTP_CONFLICT);
    }

    public function serverError(
        string $message = 'Server Error',
        mixed $errors = null
    ): JsonResponse {
        return $this->error($message, Http::HTTP_INTERNAL_SERVER_ERROR, $errors);
    }
}
