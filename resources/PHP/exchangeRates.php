<?php

ini_set('display_errors','on');
error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

		
	$url='http://api.exchangeratesapi.io/v1/latest?base='.$_REQUEST['base'].'&access_key=6cf0d8f2f45b21a94ed1772ba9901513';

    
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