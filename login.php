<?php
// Connect to the database
$servername = "localhost";
$username = "rkrisko1";
$password = "rkrisko1";
$dbname = "rkrisko1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the submitted data
$username = $_POST['username'];
$password = $_POST['lpassword'];

// Check if the user exists
$sql = "SELECT * FROM GOL_users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User found, check if the password matches
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        // Password is correct, start a session and store the user's ID and username
        session_start();
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $username;

        // Send a JSON response
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } else {
        // Password is incorrect
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    }
} else {
    // User not found
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}

$conn->close();
?>
