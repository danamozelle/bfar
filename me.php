<?php
/**
 * me.php — GET
 * Returns the logged-in user, or 401 if no valid session exists.
 */

require_once __DIR__ . '/helpers.php';

$user = require_login();

json_response(200, [
    'user' => ['email' => $user['email'], 'firstName' => $user['firstName'], 'lastName' => $user['lastName']],
]);