'use strict'; 

var pdfControllers = angular.module('pdfControllers', ['ngSanitize']);

pdfControllers.controller('PdfListCtrl', ['$scope', '$http', '$timeout',
  function($scope, $http, $timeout){
    $scope.tableLoaded = false;
    $http.get('app/data/mnr_all-v3.xml')
    .success( function(data){
      $('.spinner').css('display', 'none');
      $('.search, table').css('opacity', 0).addClass('visible').animate({opacity:1}); 
      var x2js = new X2JS(); 
      var jsonOb = x2js.xml_str2json( data );
      $scope.pdfs = jsonOb.Docs.Doc;
       
      
      $scope.fPdfs = $scope.filterPdfs($scope.pdfs, $scope.currentTitle);
      $scope.tableLoaded = true;
    })
    
    $scope.titles = "MNR*MNR/AFFM*MNR/About*MNR/Aggregates*MNR/Aquatics*MNR/Bearwise*MNR/Biodiversity*MNR/CLTIP*MNR/CNFER*MNR/ClimateChange*MNR/ContactUs*MNR/CrownLand*MNR/EmergencyManagement*MNR/Enforcement*MNR/FW*MNR/FarNorth*MNR/Forests*MNR/GeographicNames*MNR/GlobalFiles*MNR/GreatLakes*MNR/HomePage*MNR/KidsFish*MNR/LIO*MNR/LUEPS*MNR/LetsFish*MNR/NESI*MNR/NHIC*MNR/NWSI*MNR/Newsroom*MNR/OC*MNR/OFRI*MNR/OGSR*MNR/OMLC*MNR/OSG*MNR/OntarioWood*MNR/Parks*MNR/Rabies*MNR/Renewable*MNR/SORR*MNR/Species*MNR/Water*MNR/Wildlife*MNR/Youth*".split("*");
    
    $scope.currentTitle = "All";
    
    $scope.$watch('currentTitle', function(newValue, oldValue){
      $scope.fPdfs = $scope.filterPdfs($scope.pdfs, $scope.currentTitle);
      $scope.addAdded( $scope.fPdfs);
    });
    
    $scope.orderProp = 'Subject';
    
    $scope.filterPdfs = function(list, filter){
      var rets = [];
      if(list){
				if(filter == 'All'){
				
				  angular.forEach(list, function(value, key){
							value.toAdd = true;
							
							if(!value.Selected)
							  value.Selected = false; 
							
							if(!value.Accessible){
								value.Accessible = false;
							}
							if(!value.ContentPlan){
								value.ContentPlan = false;
							}
							rets.push(value);
					});
					
				}else{
					angular.forEach(list, function(value, key){
						if(value.hasOwnProperty('Account') && value.Account == filter){
							value.toAdd = true;
							/*value.Description = $scope.getExcerpt(value.Description, $scope.excerptLimit, true)     
							value.Title = $scope.getExcerpt(value.Title, $scope.excerptLimit, true)  
							value.Keywords = $scope.getExcerpt(value.Keywords, $scope.excerptLimit, true) */  
							
							
							if(!value.Selected)
							  value.Selected = false; 
							
							if(!value.Accessible){
								value.Accessible = false;
							}
							if(!value.ContentPlan){
								value.ContentPlan = false;
							}
							
							rets.push(value);
						}
					});
				}
      }
      $scope.setupPages(rets.length);
      
      
      return rets;
    }
    
    /* Sorting */
    
    $scope.orderColumn = 'OriginalName';
    
    $scope.sortOrders = {
      Subject: false,
      Upload: false,
      OriginalName: false,
      Name: false,
      Title: false,
      Description: false,
      ContentContact: false,
      Accessible: false,
      ContentPlan: false,
      HasTranslationLang: false,
      Keywords: false,
      PublishDate: false,
      ModifiedDate: false,
    }
    
    $scope.sortClick = function( sortProp){
      $scope.sortOrders[sortProp] = !$scope.sortOrders[sortProp];
      $scope.orderColumn = $scope.sortOrders[sortProp] ? sortProp : '-'+sortProp
      console.log($scope.orderColumn);
    }
    
    $scope.addList = []
    
    $scope.addAdded = function( list ){
       console.log( 'addList: ', $scope.addList);
    
			 angular.forEach(list, function(lv, lk){
			   $scope.fPdfs[lk].toAdd = true; 
					angular.forEach($scope.addList, function(v, k){
						if( lv.Name == v.Name){
							$scope.fPdfs[lk].toAdd = false;
							if( v.Accessible==1 ){
							  $scope.fPdfs[lk].Accessible = true; 
							}
							if(v.Title)
								$scope.fPdfs[lk].Title = v.Title;
							if(v.Description)
								$scope.fPdfs[lk].Description = v.Description;
							if(v.ContentContact)
								$scope.fPdfs[lk].ContentContact = v.ContentContact;
							$scope.addList[k] = $scope.fPdfs[lk]; 
						}
					});
				});
    }
    
    $scope.hasData = function(field){
      if(field.length) 
        return true
      return false
    }
    
    $scope.toggleAdded = function(pdf){
      if( pdf.toAdd)
        $scope.addPdf( pdf )
      else
        $scope.removePdf(pdf)
      pdf.toAdd = !pdf.toAdd
      //console.log($scope.addList);
    }
    
    $scope.addPdf = function( pdf){
      var matches = 0;
      for( var i = 0, j=$scope.addList.length; i< j; i++){
         if( $scope.addList[i] == pdf)
           matches ++;
      }
      
      if(matches <= 0){
        $scope.addList.push(pdf);
        $scope.addList.sort($scope.sortList);
      }
      console.log('added to al', $scope.addList);
    }
    
    $scope.removePdf = function(pdf){
    
      for( var i = 0, j=$scope.addList.length; i< j; i++){
         if( $scope.addList[i] == pdf){
           $scope.addList.splice(i, 1);
           $scope.addList.sort($scope.sortList);
         }
      }
    }
    
    $scope.sortList = function(a, b){
				if( a.Account < b.Account)
					return -1;
				if( a.Account > b.Account)
					return 1;
				return 0;
		}
		
		$scope.getCSV = function(){
		  var gurl = 'app/getCSV.php';
		  $http.get(gurl).success( function(data){
		     var csvdata = data.split('*'),
		     names = [];
		  
		     for( var i = 0, j= csvdata.length; i<j; i++){
		     	  var dataArr = csvdata[i].split('$$');
		     	  if( dataArr[0] && dataArr[1] )
		    	    names.push( {Name: dataArr[0], Accessible:dataArr[1], Title:dataArr[2], Description:dataArr[3], ContentContact:dataArr[4]} ); 
		     }
		     $scope.addList = [];
				 $scope.addList.length = 0;
				 for( var i = 0, j=names.length; i<j; i++){
				   $scope.addList.push(names[i]); 
				 }
		     $scope.addAdded($scope.fPdfs); 
		  });
		}
		
		$scope.rgetCSV = function(){
		  /* rget is Reconciling get. Get the file,
		  check it against the current selected list and merge */
		  var gurl = 'app/getCSV.php',
		  names = [];
		  $http.get(gurl).success( function(data){
		  
		      var addBackup = $scope.addList;
		    	var csvdata = data.split('*'); 
		    	for( var i = 0, j = csvdata.length; i<j; i++){
		    		var dataArr = csvdata[i].split('$$');
		    		names.push( {Name: dataArr[0], Accessible:dataArr[1], Title:dataArr[2], Description:dataArr[3], ContentContact:dataArr[4]} ); 
		    	}
		    
		    
		    /* create a backup list of the current selections
		     * loop through names and remove duplicates from 
		     * selections.
		     * combine remainder with new list*/
		    for( var i = 0, j = names.length; i < j; i++){
		      for(var n = 0, m = addBackup.length; n < m; n++){
		      
		        var theName = addBackup[n] ? addBackup[n].Name : 'Gibberish';
		        if( names[i].Name == theName){
		          addBackup.splice(n, 1);
		        }
		      }
		    }
		    
		    for( var i in addBackup){
		      if(addBackup[i])
		        names.push( {Name: addBackup[i].Name, Accessible: addBackup[i].Accessible, toAdd: false, Description:addBackup[i].Description, Title:addBackup[i].Title, ContentContact:addBackup[i].ContentContact} );
		    }
		    
		    $scope.addList = []
		    for( var i in names){
		      $scope.addList.push(names[i])
		      console.log ('backups: ', $scope.addList);
		    }
		      
		    $scope.addAdded($scope.fPdfs);
		    
		    $scope.synced = true; 
		    $timeout( function(){ $scope.synced = false;}, 10000); 
		    		    
		  });
		}
		
		$scope.saveCSV = function(){
		  
		  
		  var purl = 'app/putCSV.php',
		  postData = $scope.addList;
		  console.log(postData); 
		  
		  $http({
            url: purl,
            method: "POST",
            data: postData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                //trigger save message
                $('.save-message').fadeToggle(function(){
                  $('.save-message').fadeToggle(2000);
                })
            }).error(function (data, status, headers, config) {
                console.log(status);
            });
		}
		
		//drop the MNR/ from account names
		$scope.dropMNR = function( title ){
		  if(title.length > 3)
		    return title.split('MNR/')[1];
		  return title
		}
		
		/* Paths for files, modify the 
		   default in the line below */
		   
		$scope.defaultPath = 'path/to/';
		
		$scope.getPath = function(path) {
		  var newPath = path.split('public://mnr_docs/')[1];
		  return $scope.defaultPath+newPath;
		}
		
		/*synchronization*/
		$scope.synced = false;
		
		/*select and export*/
		$scope.allSelected = false;
		
		$scope.selectAll = function(){
			console.log( 'clicked!');
			if( $scope.allSelected){
					angular.forEach($scope.fPdfs, function(item){
						item.Selected = false;
					});
			}else{
					angular.forEach($scope.fPdfs, function(item){
						item.Selected = true;
					});
			}
			$scope.Selected = !$scope.Selected;
		}
		
		
		/* bootstrap pagination controls */
		
		$scope.currentPage = 0;
		$scope.pageSize = 50;
		$scope.numberOfPages = 0;
		$scope.dataLength = 0;
		
		$scope.setupPages = function(len){
		  $scope.dataLength = len;
		  $scope.numberOfPages =  Math.ceil(len / $scope.pageSize);
		  
		}
	
		/* field visibility toggles */
		
		$scope.accountVisible = false
		$scope.subjectVisible = false
		$scope.fileNameVisible = true
		$scope.stellentNameVisible = false
		$scope.titleVisible = true
		$scope.descriptionVisible = true
		$scope.ownerVisible = true
		$scope.accessibleVisible = true
		$scope.contentPlanVisible = false
		$scope.otherLanguageVisible = false
		$scope.keywordsVisible = false
		$scope.publishedVisible = true
		$scope.modifiedVisible = true
		$scope.selectVisible = true
		
		$scope.toggleColumn = function( column ){
		  $scope[column] = ! $scope[column];
		}
		
		/* excerpts */
		$scope.excerptLimit = 50;
		
		$scope.getExcerpt = function(str, limit, readMore) {
			var cutTo, firstHalf, secondHalf, tempText;
			if (limit == null) {
				limit = 100;
			}
			if (readMore == null) {
				readMore = false;
			}
			tempText = str.substr(0, limit);
			cutTo = tempText.lastIndexOf(' ');
			if (limit > 30 && cutTo > (limit - 20)) {
				firstHalf = str.substr(0, cutTo);
				secondHalf = str.substr(cutTo + 1, str.length);
				return '<span class="excerpt">' + firstHalf + '... </span><span class="remaining-text hidden">' + secondHalf + '</span>' + '<a class="more-content" data-expanded="1">expand<i class="fa fa-caret-down excerpt-icon"></i></a>'; 
			}
			return '<span>' + str + '</span>';
	  }
	  
	  $scope.$on('LastElem', function(e){
	  
       console.log( 'ng-repeat done', $scope.addList);
       
	    $('.td-excerpt').each( function(){
	      $(this).on('click', '.more-content', function(ev){
	        ev.stopPropagation();
	        if( !$(this).hasClass('expanded') ){
	          $(this).addClass('expanded');
	          $(this).html('  close<i class="fa fa-caret-up"></i>');
	        }else{
	          $(this).removeClass('expanded')
	          $(this).html('expand<i class="fa fa-caret-down excerpt-icon"></i>');
	        }
	        var $parent = $(this).closest('td')
	        $parent.find('.remaining-text').fadeToggle( function(){$parent.find('.remaining-text').toggleClass('hidden')});
	      })
	    });
	  })
		
		
		/*watch addlist changes*/
		$scope.$watch('addList', function(newValue, oldValue){
		  console.log('watchchange', newValue, oldValue);
		  if( newValue < oldValue){
		  	$scope.addList = oldValue;
		  }
		})
  
  }])
  .directive('table', function(){
    return({
      restrict: "E",
      link: function( $scope, $element, attr){
        $scope.$watch('tableLoaded', function(newValue, oldValue){
          if( newValue == true){
            console.log ('added table');  
            $scope.getCSV()
          }
        });
      }
    });
  })
  .directive('repeatDirective', function() {
		return function(scope, element, attrs) {
			if (scope.$last){
				scope.$emit('LastElem');
			}
		}
	})
  .filter('startFrom', function(){
    return function(input, start){
      start = +start;
      return input.slice(start);
    }
  });
  
