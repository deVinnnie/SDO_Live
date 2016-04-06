<?php
	header("Content-Type:application/json");
	if(isset($_GET["channel"])){
		$channel = $_GET["channel"];
	}
	else{
		$channel = "aia_0094";
	}
	$rss_feed = file_get_contents('http://sdo.gsfc.nasa.gov/feeds/' . $channel . '.rss');
	$rss_feed = str_replace(array("\n", "\r", "\t"), "", $rss_feed);

	$simpleXml = simplexml_load_string($rss_feed);
	$items = $simpleXml->xpath("//item[position()>1]");

	while(list( , $node) = each($items)) {
		unset($node[0][0]);
	}
    $json = json_encode($simpleXml, JSON_UNESCAPED_SLASHES);
    echo $json;
?>
