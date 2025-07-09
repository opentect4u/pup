<?php
defined('BASEPATH') OR exit('No direct script access allowed');


function patch_csrf_cookie()
{
    foreach (headers_list() as $header) {
        if (stripos($header, 'Set-Cookie: csrf_cookie_name=') !== false) { // Use your actual csrf_cookie_name
            header_remove('Set-Cookie');
            $new = $header; // Start with the original header
            
            // Remove any SameSite=None or Secure that might have been added
            $new = preg_replace('/; SameSite=(None|Lax|Strict)/i', '', $new); // Remove any SameSite
            $new = preg_replace('/; Secure/i', '', $new); // Remove Secure

            // Append SameSite=Lax specifically if you want to ensure it,
            // but for HTTP, the browser default is often Lax for this scenario.
            // Explicitly setting it might help, but ensure it doesn't break.
            // For pure HTTP, often simply removing SameSite=None is enough.
            // If the browser doesn't send the cookie with no samesite, try adding ; SameSite=Lax
            // $new .= '; SameSite=Lax'; // <--- Try adding this if it still fails without it.

            log_message('debug', "Patched CSRF Cookie Header for HTTP: " . $new);
            header($new, false); // false means don't replace existing headers of the same name
        }
    }
}