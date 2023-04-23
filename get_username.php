<?php
session_start();

if (isset($_SESSION['username'])) {
    // User is logged in, send the username
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'username' => $_SESSION['username']]);
} else {
    // User is not logged in
    header('Content-Type: application/json');
    echo json_encode(['success' => false]);
}
?>
