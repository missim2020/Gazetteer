<?php
$executionStartTime = microtime(true);

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

//  $output['status']['code'] = "200";
//  $output['status']['name'] = "ok";
//  $output['status']['description'] = "success";
//  //$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
//  //$output['data'] = JSON.parse($airports_list);

//  header('Content-Type: application/json; charset=UTF-8');



 $json_encoded = json_encode($airports_list);
 
  
  echo $json_encoded;








?>
