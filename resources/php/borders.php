<?php

$executionStartTime = microtime(true);

$value= $_POST['value'];

$filename = 'countryBorders.geo.json';

$borders = file_get_contents($filename);

$json_decoded=json_decode($borders,true);

 $country;
foreach ($json_decoded['features'] as $feature) {
   
if ($feature['properties']["iso_a2"]===$value) {
    $country=$feature;

};
    
};

    // $output['status']['code'] = "200";
    // $output['status']['name'] = "ok";
    // $output['status']['description'] = "success";
    // $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    // $output['data'] = $country;

    // header('Content-Type: application/json; charset=UTF-8');



$json_encoded = json_encode($country);
 
 echo $json_encoded;




?>
