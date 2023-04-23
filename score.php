<?php
// Replace the values below with your actual database credentials
$servername = "localhost";
$username = "rkrisko1";
$password = "rkrisko1";
$dbname = "rkrisko1";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the user_id based on the provided username
$user = $_POST['username'];
$sql = "SELECT id, password FROM GOL_users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Verify the password
if (password_verify($_POST['password'], $row['password'])) {
    $user_id = $row['id'];

    // Insert the new score and elapsed time into GOL_scores
    $max_population = $_POST['max_population'];
    $elapsed_time = $_POST['elapsed_time'];
    $sql = "INSERT INTO GOL_scores (user_id, max_population, elapsed_time) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $user_id, $max_population, $elapsed_time);
    $stmt->execute();

    echo "Score submitted successfully";
} else {
    echo "Invalid username or password";
}

$stmt->close();
$conn->close();
?>
