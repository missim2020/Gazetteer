<?php

$executionStartTime = microtime(true);

$filename = 'countryBorders.geo.json';

$borders = file_get_contents($filename);

$json_decoded=json_decode($borders,true);

$country_list=[];
foreach ($json_decoded['features'] as $feature) {
       
    $country['code'] = $feature['properties']["iso_a2"];

    $country['name'] = $feature['properties']['name'];

    array_push($country_list, $country);

};

usort($country_list, function ($item1, $item2) {

 
    return $item1['name'] <=> $item2['name'];

});

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country_list;

    header('Content-Type: application/json; charset=UTF-8');

$json_encoded = json_encode($country_list);
 
 echo $json_encoded;








?>
