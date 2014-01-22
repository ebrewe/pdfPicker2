<?php

  $data = json_decode(file_get_contents("php://input"));
  
  $list = array();
  $list[0] = array('file_name', 'accessible', 'title', 'description', 'keywords', 'publish_date');
    $count = 1;
  foreach( $data as $key=>$value){
  
		$count++;
    $c = sizeof($list);
    $list[$c] = array();
    
      if( $value->Title && $value->Name!== 'file_name' ){
				/*if( ($k == 'Name' && $v !== 'file_name') || $k == 'Accessible' || $k =='Title' || $k == 'Description' || $k == 'PublishDate' ){
					//$list[$c][] == $v;
					$list[$c][] = $v;
				}*/
				
				$list[$c][] = $value->Name;
				$list[$c][] = $value->Accessible;
				$list[$c][] = $value->Title;
				$list[$c][] = $value->Description;
				$list[$c][] = $value->ContentContact;
				$list[$c][] = $value->Keywords;
				$list[$c][] = $value->PublishDate; 
			}
  }
  $flist = array_filter($list);
 // print_r($flist);
  
  $fp = fopen('data/MNR_exported_pdfs.csv', 'w');

	foreach ($flist as $fields) {
			fputcsv($fp, $fields);
	}
	
	fclose($fp);
	echo dirname(__FILE__)."/data/MNR_exported_pdfs.csv"
?>