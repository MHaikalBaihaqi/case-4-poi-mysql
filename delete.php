<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'case4pemweb';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

$sql = "DELETE FROM POI WHERE LATITUDE='$latitude' AND LONGITUDE='$longitude'";

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
