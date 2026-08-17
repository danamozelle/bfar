<?php
/**
 * db.php — MySQL database connection
 */

require_once __DIR__ . '/config.php';

$host = 'localhost';
$dbname = 'da_bfar';
$username = 'root';
$password = '';

$pdo = null;

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

// Helper function to find user by email
function find_user_by_email($email) {
    global $pdo;
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    return $stmt->fetch();
}

// Helper function to find user by reset token
function find_user_by_reset_token($tokenHash) {
    global $pdo;
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare(
        'SELECT u.* FROM users u 
         JOIN password_resets pr ON u.id = pr.user_id 
         WHERE pr.token_hash = ? AND pr.expires_at > ? AND pr.used_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([$tokenHash, $now]);
    return $stmt->fetch();
}
?>