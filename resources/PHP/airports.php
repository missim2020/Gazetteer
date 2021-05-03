<?php


$text= $_POST['text'];


 $filename = 'airports23.json';

 $airports = file_get_contents($filename);
 
 $json_decoded=json_decode($airports,true);
 

 
 $airports_list=[];
 $airport;
 
foreach ($json_decoded as $feature) {
    $airport['lat'] = $feature['lat'];
     $airport['lng'] = $feature['lon'];
     $airport['name'] = $feature['name'];
     $airport['city'] = $feature['city'];
     $airport['country'] = $feature['country']; 
  
     if($feature['country']===$text){
     
    array_push($airports_list, $airport);
    
  }
        
 
 };
 $json_encoded = json_encode($airports_list);
 
  
  echo $json_encoded;








?>
