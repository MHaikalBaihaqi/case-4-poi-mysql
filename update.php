<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'case4pemweb';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$oldLatitude = $_POST['oldLatitude'];
$oldLongitude = $_POST['oldLongitude'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$namalokasi = $_POST['namalokasi'];
$deskripsi = $_POST['deskripsi'];
$alamat = $_POST['alamat'];
$kategori = $_POST['kategori'];
$phone = $_POST['phone'];
$website = $_POST['website'];

$sql = "UPDATE POI SET LATITUDE='$latitude', LONGITUDE='$longitude', NAMA_LOKASI='$namalokasi', DESKRIPSI='$deskripsi', ALAMAT='$alamat', KATEGORI='$kategori', phone='$phone', website='$website' WHERE LATITUDE='$oldLatitude' AND LONGITUDE='$oldLongitude'";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
