<?php

$filename = 'airports23.json';

$airports = file_get_contents($filename);

$json_decoded=json_decode($airports, true);

$json_encoded = json_encode($json_decoded);
 file_put_contents($filename, $json_encoded);

 echo $json_encoded;

?>
