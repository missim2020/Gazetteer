<?php

$filename = 'countryBorders.geo.json';

$borders = file_get_contents($filename);

$json_decoded=json_decode($borders, true);

$json_encoded = json_encode($json_decoded);
 file_put_contents($filename, $json_encoded);

 echo $json_encoded;


// $filename = 'countryBorders.geo.json';

// $borders = file_get_contents($filename);

// $json_decoded=json_decode($borders,true);

// $country_list=[];
// foreach ($json_decoded['features'] as $feature) {
       

//     $country['code'] = $feature['properties']["iso_a3"];

//     $country['name'] = $feature['properties']['name'];

//     array_push($country_list, $country);

// };
// $json_encoded = json_encode($country_list);
//  //file_put_contents($filename, $country_list);

//  var_dump($json_encoded);















?>
