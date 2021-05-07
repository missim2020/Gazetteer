<?php

ini_set('display_errors','on');
error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	$countryBoundingBoxUrl='http://api.geonames.org/countryInfoJSON?country='.$_REQUEST['countryShortCode'].'&username=missim';
	   

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $countryBoundingBoxUrl);

	$countryBoundingBox = json_decode(curl_exec($ch),true);

	$boundingBox = $countryBoundingBox['geonames'][0];

	$url='http://api.geonames.org/wikipediaBoundingBoxJSON?north='.$boundingBox['north'].'&south='.$boundingBox['south'].'&east='.$boundingBox['east'].'&west='.$boundingBox['west'].'&username=missim';
	   

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>