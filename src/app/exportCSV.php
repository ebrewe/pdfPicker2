<?php

 //$data = json_decode(file_get_contents("php://input"));
 $data = $_GET[];
 
 /*$list = array();
  $list[0] = array('file_name', 'accessible', 'title', 'description', 'keywords', 'publish_date');
    $count = 1;
  foreach( $data as $key=>$value){
  
		$count++;
    $c = sizeof($list);
    $list[$c] = array();
    
      if( $value->Title && $value->Name!== 'file_name' ){
      
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
  
  header("Content-type: text/csv");
  header("Content-Disposition: attachment; filename=MNR_file_export.csv");
  header("Pragma: no-cache");
  header("Expires: 0");
  
  foreach( $list as $item=>$values ){
    $str  = '';
    foreach( $values as $k=> $v){
      $str.=$v;
      $str.=",";
    }
    rtrim($str, ","); 
    echo $str;
    echo "\n";
  }*/
  echo $data;

?>