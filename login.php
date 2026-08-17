<?php
/**
 * login.php — POST { email, password, remember (optional bool) }
 * Verifies credentials and starts a session.
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$body = read_json_body();
$email    = trim($body['email'] ?? '');
$password = (string) ($body['password'] ?? '');
$remember = !empty($body['remember']);

if ($email === '' || $password === '') {
    json_response(400, ['error' => 'Email and password are both required.']);
}

$email = strtolower($email);

$stmt = $pdo->prepare('SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

// If user not found OR password does not match
if (!$user || !password_verify($password, $user['password_hash'])) {
    // We use a generic message so hackers can't tell if the email exists
    json_response(401, ['error' => 'Incorrect email or password.']);
}

// If "remember me" is checked, extend the session cookie's lifetime to 30 days
if ($remember) {
    session_set_cookie_params(30 * 24 * 60 * 60);
}
start_app_session();
session_regenerate_id(true); // prevents session fixation on login

$_SESSION['user_id']    = $user['id'];
$_SESSION['email']      = $user['email'];
$_SESSION['first_name'] = $user['first_name'];
$_SESSION['last_name']  = $user['last_name'];

json_response(200, [
    'user' => ['email' => $user['email'], 'firstName' => $user['first_name'], 'lastName' => $user['last_name']],
]);
?>