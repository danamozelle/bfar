<?php
/**
 * register.php — POST { email, password, firstName, lastName }
 * Creates a new account and logs the user in.
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$body = read_json_body();
$email     = trim($body['email'] ?? '');
$password  = (string) ($body['password'] ?? '');
$firstName = trim($body['firstName'] ?? '');
$lastName  = trim($body['lastName'] ?? '');

if ($email === '' || $password === '') {
    json_response(400, ['error' => 'Email and password are both required.']);
}
if (!is_valid_email($email)) {
    json_response(400, ['error' => 'Please enter a valid email address.']);
}
if (strlen($password) < 8) {
    json_response(400, ['error' => 'Password must be at least 8 characters.']);
}

$email = strtolower($email);

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    json_response(409, ['error' => 'An account with that email already exists. Try logging in.']);
}

$passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$id = generate_uuid_v4();

$stmt = $pdo->prepare(
    'INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$id, $email, $passwordHash, $firstName, $lastName]);

start_app_session();
$_SESSION['user_id']    = $id;
$_SESSION['email']      = $email;
$_SESSION['first_name'] = $firstName;
$_SESSION['last_name']  = $lastName;

json_response(201, [
    'user' => ['email' => $email, 'firstName' => $firstName, 'lastName' => $lastName],
]);