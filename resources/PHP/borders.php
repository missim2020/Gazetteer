<?php


$value= $_POST['value'];

//echo($value);

$filename = 'countryBorders.geo.json';

$borders = file_get_contents($filename);

$json_decoded=json_decode($borders,true);

 $country;
foreach ($json_decoded['features'] as $feature) {
   
if ($feature['properties']["iso_a2"]===$value) {
    $country=$feature;

};

    // $country['code'] = $feature['properties']["iso_a2"];

    // $country['name'] = $feature['properties']['name'];

    // array_push($country_list, $country);

};
$json_encoded = json_encode($country);
 //file_put_contents($filename, $country_list);

 echo $json_encoded;





// $filename = 'countryBorders.geo.json';

// $borders = file_get_contents($filename);

// $json_decoded=json_decode($borders, true);

// $json_encoded = json_encode($json_decoded);
//  file_put_contents($filename, $json_encoded);

//  echo $json_encoded;









?>
