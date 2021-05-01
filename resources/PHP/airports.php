<?php

// $filename = 'airports23.json';

// $airports = file_get_contents($filename);

// $json_decoded=json_decode($airports, true);

// $json_encoded = json_encode($json_decoded);
//  file_put_contents($filename, $json_encoded);

//  echo $json_encoded;


 $filename = 'airports23.json';

 $airports = file_get_contents($filename);
 
 $json_decoded=json_decode($airports,true);
 
 $airports_list=[];
 foreach ($json_decoded as $feature) {
    
     $airport['country'] = $feature['country']; 
     $airport['lat'] = $feature['lat'];
     $airport['lng'] = $feature['lon'];
     $airport['name'] = $feature['name'];
     $airport['city'] = $feature['city'];
 
     array_push($airports_list, $airport);
 
 };
 $json_encoded = json_encode($airports_list);
  
  echo $json_encoded;








?>
