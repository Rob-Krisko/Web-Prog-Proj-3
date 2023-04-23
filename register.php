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
$username = $_POST['name'];
$password = $_POST['pass'];
$passwordConfirm = $_POST['passtwo'];

if ($password !== $passwordConfirm) {
    // Passwords do not match
    echo "Passwords do not match.";
} else {
    // Check if the username is already taken
    $sql = "SELECT * FROM GOL_users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username is already taken
        echo "Username is already taken.";
    } else {
        // Insert the new user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO GOL_users (username, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $username, $hashed_password);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "Registration successful. <a href='login.html'>Click here to login</a>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
