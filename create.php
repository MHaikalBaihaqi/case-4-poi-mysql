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
$namalokasi = $_POST['namalokasi'];
$deskripsi = $_POST['deskripsi'];
$alamat = $_POST['alamat'];
$kategori = $_POST['kategori'];
$phone = $_POST['phone'];
$website = $_POST['website'];

$sql = "INSERT INTO POI (LATITUDE, LONGITUDE, NAMA_LOKASI, DESKRIPSI, ALAMAT, KATEGORI, PHONE, WEBSITE) VALUES ('$latitude', '$longitude', '$namalokasi', '$deskripsi', '$alamat', '$kategori', '$phone', '$website')";

if ($conn->query($sql) === TRUE) {
    echo "Record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
