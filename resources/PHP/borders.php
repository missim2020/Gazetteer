<?php


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
$json_encoded = json_encode($country);
 
 echo $json_encoded;




?>
