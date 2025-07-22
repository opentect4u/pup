<?php
function csrf_override()
{
    // Only POST requests need CSRF check
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

    // Only if CSRF is enabled
      $request_uri = $_SERVER['REQUEST_URI'] ?? '';

     if (strpos($request_uri, '/mobileApi/') !== false) {
        log_message('debug', "CSRF override: Skipping for App URI: $request_uri");
        return;
    }
    if (!config_item('csrf_protection')) return;

    $csrf_token_name  = config_item('csrf_token_name');
    $csrf_cookie_name = config_item('csrf_cookie_name');

    $token_post   = $_POST[$csrf_token_name] ?? '';
    $token_cookie = $_COOKIE[$csrf_cookie_name] ?? '';

    // Add logging for debugging
    log_message('debug', "CSRF Override Check: Token from POST: " . $token_post);
    log_message('debug', "CSRF Override Check: Token from Cookie: " . $token_cookie);
    log_message('debug', "CSRF Override Check: Request Method: " . $_SERVER['REQUEST_METHOD']);
    log_message('debug', "CSRF Override Check: Host: " . $_SERVER['HTTP_HOST']);


    if (!$token_post || !$token_cookie || $token_post !== $token_cookie) {
        log_message('error', "CSRF VALIDATION FAILED (HTTP): POST: {$token_post}, Cookie: {$token_cookie}");
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode([
            'status'  => 0,
            'message' => 'CSRF validation failed',
            'error_code' => 403
        ]);
        exit;
    }
}

?>