<?php
include 'conectionpbx.php'; 

$sql = "SELECT nome, ramal FROM lis_ramais WHERE ramal";
$result = $conn->query($sql);

$data = array(); 
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} 

echo json_encode($data); 
$conn->close();
?>
