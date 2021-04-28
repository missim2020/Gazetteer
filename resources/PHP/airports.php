<?php

$filename = 'airports23.json';

$airports = file_get_contents($filename);
//var_dump($airports);


//print_r($airports);

$json_decoded=json_decode($airports, true);

$json_encoded = json_encode($json_decoded);
 file_put_contents($filename, $json_encoded);

//exit($airports);
 echo $json_encoded;



// ini_set('display_errors','on');
// error_reporting(E_ALL);

// 	$executionStartTime = microtime(true) / 1000;
    
//     $url='airports23.json';
//     //$url='countryBorders.geo.json';

// 		$ch = curl_init();
// 	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// 	curl_setopt($ch, CURLOPT_URL,$url);

// 	$result=curl_exec($ch);

// 	curl_close($ch);

// 	$decode = json_decode($result,true);	

// 	$output['status']['code'] = "200";
// 	$output['status']['name'] = "ok";
// 	$output['status']['description'] = "mission saved";
// 	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
// 	$output['data'] = $decode;


	
// 	header('Content-Type: application/json; charset=UTF-8');
    
// 	echo json_encode($output); 




?>
