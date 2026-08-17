<?php
/**
 * helpers.php — Shared utility functions
 */

function read_json_body() {
    return json_decode(file_get_contents('php://input'), true);
}

function json_response($status, $data) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function generate_uuid_v4() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function start_app_session() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function require_login() {
    start_app_session();
    if (!isset($_SESSION['user_id'])) {
        json_response(401, ['error' => 'You are not logged in.']);
    }
    return $_SESSION;
}

function get_user_by_id($pdo, $id) {
    $stmt = $pdo->prepare('SELECT id, email, first_name, last_name FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    return $stmt->fetch();
}
?>