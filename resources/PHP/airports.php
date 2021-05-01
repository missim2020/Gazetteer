<?php

// $filename = 'airports23.json';

// $airports = file_get_contents($filename);

// $json_decoded=json_decode($airports, true);

// $json_encoded = json_encode($json_decoded);
//  file_put_contents($filename, $json_encoded);

//  echo $json_encoded;

$text= $_POST['text'];

//echo($text);


 $filename = 'airports23.json';

 $airports = file_get_contents($filename);
 
 $json_decoded=json_decode($airports,true);
 

 
 $airports_list=[];
 $airport;
 //foreach($json_decoded as $key=>$value)
foreach ($json_decoded as $feature) {
    $airport['lat'] = $feature['lat'];
     $airport['lng'] = $feature['lon'];
     $airport['name'] = $feature['name'];
     $airport['city'] = $feature['city'];
     $airport['country'] = $feature['country']; 
  
     if($feature['country']===$text){
      //$airport=$feature;
    array_push($airports_list, $airport);
    
  }//else{
    //echo("erorr");
 // }
   
     
 
     
 
 };
 $json_encoded = json_encode($airports_list);
 //$json_encoded = json_encode($airport);
  
  echo $json_encoded;








?>
