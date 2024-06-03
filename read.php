<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'case4pemweb';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM POI";
$result = $conn->query($sql);

$pois = [];
while ($row = $result->fetch_assoc()) {
    $pois[] = $row;
}

echo json_encode($pois);

$conn->close();
