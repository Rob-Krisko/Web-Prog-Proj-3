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
$sql = "SELECT id FROM GOL_users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    $user_id = $row['id'];

    // Check if a record exists for the user in the GOL_scores table
    $sql = "SELECT * FROM GOL_scores WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $max_population = $_POST['max_population'];
    $elapsed_time = $_POST['elapsed_time'];

    if ($row) {
        // Update the existing record with new max_population and elapsed_time
        $sql = "UPDATE GOL_scores SET max_population = ?, elapsed_time = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $max_population, $elapsed_time, $user_id);
        $stmt->execute();
    } else {
        // Insert a new record with max_population and elapsed_time
        $sql = "INSERT INTO GOL_scores (user_id, max_population, elapsed_time) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $user_id, $max_population, $elapsed_time);
        $stmt->execute();
    }

    echo "Score submitted successfully";
} else {
    echo "Invalid username";
}

$stmt->close();
$conn->close();
?>
