<?php

  class CSVReader{
    private $url;
    private $csvdata;
    private $names = array();
    
    public function __construct(){
      $this->url = dirname(__FILE__)."/data/included_pdfs.csv";
    }
    
    function getFile(){
      if( file_exists($this->url)){
        $file = fopen($this->url, "r");
        
        $count = 0;
				while (($this->csvdata = fgetcsv($file, 12000, ",")) !== FALSE) {
						if( $count > 0){
						  $file_name = utf8_decode($this->csvdata[0]);
							$accessible = ($this->csvdata[1]) ? 1 : 0; 
							$title = utf8_decode($this->csvdata[2]); 
							$description = utf8_decode($this->csvdata[3]); 
							$contact = utf8_decode($this->csvdata[4]); 
							$this->names[] = $file_name."$$".$accessible."$$".$title."$$".$description."$$".$contact;
						}
						$count++;
				}

        fclose($file); 
        return true;
      }else{
        return false;
      }
    }
    
    function getNames(){
      foreach( $this->names as $item){
        echo $item."*"; 
      }
    }
    
  }
  
  $cr = new CSVReader();
  $cr->getFile();
  $cr->getNames();
?>