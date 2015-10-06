<?php
ini_set('display_errors', 1); 
//database login info
$host = '10.12.12.215';
$port = '5432';
$dbname = 'geoprod';
$user = 'lee';
$password = '111222';
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
	echo "Not connected : " . pg_error();
	exit;
} else {
	echo "CONNECTED!"
}
//get the table and fields data
$table = $_GET['table'];
$fields = $_GET['fields'];
$pointgeom = $_GET['geom'];
$lat = $_GET['lat'];
$long = $_GET['lng'];

echo $lat;
echo "\r\n";
echo $long;
echo "\r\n";
//turn fields array into formatted string
$fieldstr = "";
foreach ($fields as $i => $field){
	$fieldstr = $fieldstr . "$field, ";
}

//get the geometry as geojson in WGS84
$fieldstr = $fieldstr . "ST_AsGeoJSON(ST_Transform(the_geom,4326))";

//create basic sql statement
//$sql = "SELECT $fieldstr FROM $table  WHERE ST_Contains(ST_Transform(hse2012.the_geom,4326),  ST_SetSRID(ST_Point(-95.0537109375, 45.191844756526685),4326));
$sql = "SELECT $fieldstr FROM $table ";


//if a query, add those to the sql statement
// if (isset($_GET['featname'])){
// 	$featname = $_GET['featname'];
// 	$distance = $_GET['distance'] * 1000; //change km to meters
// 	//join for spatial query - table geom is in EPSG:26916
// 	$sql = $sql . " LEFT JOIN $table r ON ST_DWithin(l.geom, r.geom, $distance) WHERE r.featname = '$featname';";
// }
 //echo "\r\n";
 //echo $sql;
//send the query
if (!$response = pg_query($conn, $sql)) {
	echo "\r\n";
	echo "A query error occured.\n";
	exit;
}
//echo the data back to the DOM
while ($row = pg_fetch_row($response)) {
	foreach ($row as $i => $attr){
		echo $attr.", ";
	}
	echo ";";
}
?>