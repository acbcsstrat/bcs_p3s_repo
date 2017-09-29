app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: function($stateParams, $state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http, patentsPhaseTabService, $rootScope) {

		var vm = this;

		vm.testid = 1;

		vm.patentsTabs = {
			all: 1,
			green: 2,
			yellow: 3,
			red: 4,
			blue: 5,
			brown: 6
		}

		vm.$onInit = () => {

			var patents = vm.patents;

			patents.forEach(function(item){

			if (item.costBandColour === 'Green') {
			     	var now = new Date(); //get todays date
					var d = new Date(1505430000622 - 7889238000); //minus 3 months from the costband end date
					d.setHours(0, 0, 0, 0); //set the hours to midnight
					var greenStart = d.getTime(); //get the begin date of green in milliseconds
					var end = patents[0].costBandEndDate - greenStart; //get total time between dates
					var timeDiff = now.getTime() - greenStart; //get remainding time
					var perc = Math.round((timeDiff / end) * 100) //work percentage

					vm.progressBar = [{value: perc}];

			} else {
				var color = item.costBandColour;
				var start = new Date(item.costBandEndDate);
				var end = patents[0].costBandEndDate - start; 
				var now = new Date(); //get todays date
				
				var end = patents[0].costBandEndDate - start; //get total time between dates
				var timeDiff = now.getTime() - start; //get remainding time
				var perc = Math.round((timeDiff / end) * 100) //work percentage

				vm.progressBar = [{value: perc}];
			}

						

			})


			var allPatents = [];
			var greenPatents = [];
			var yellowPatents = [];
			var redPatents = [];
			var bluePatents = [];
			var brownPatents = [];

	     	patents.forEach(function(item){

	    //  		switch(item.costBandColour) {
	    //  			case item.costBandColour:
	    //  				allPatents.push(item);

	    //  			case item.costBandColour == 'Green':
	    //  				greenPatents.push(item);
	    //  			break;
	    //  			case item.costBandColour == 'Yellow':
	    //  				yellowPatents.push(item)
	    //  			break;
	    //  			case item.costBandColour == 'Red':
	    //  				redPatents.push(item)
     // 				break;
     // 				case item.costBandColour == 'Blue':
     // 					bluePatents.push(item)
 				// 	break;
 				// 	case item.costBandColour == 'Black':
 				// 		brownPatents.push(item)
					// break;
					// default:
					// 	vm.patents = null;
	    //  		}


	     		if(item.costBandColour) {
	     			allPatents.push(item);
	     		} else {
	     			vm.patents = null;
	     		}

	     		if(item.costBandColour == 'Green') {
	     			greenPatents.push(item);
	     		}	else {
	     			vm.patents = null;
	     		}

	     		if(item.costBandColour == 'Yellow') {
	     			yellowPatents.push(item)
	     		} else {
	     			vm.patents = null;
	     		}

	     		if(item.costBandColour == 'Red') {
	     			redPatents.push(item)
	     		} else {
	     			vm.patents = null;
	     		}

	     		if(item.costBandColour == 'Blue') {
	     			bluePatents.push(item)
	     		} else {
	     			vm.patents = null;
	     		}

	     		if(item.costBandColour == 'Brown') {
	     			brownPatents.push(item)
	     		} else {
	     			vm.patents = null;
	     		}

	     	})
	     	
	     	if(allPatents.length === 0) {
				vm.allPatentsLength = 0;
			} else {
				vm.allPatentsLength = allPatents.length
			}

	     	if(greenPatents.length === 0) {
 				vm.greenPatentsLength = 0;
 			} else {
 				vm.greenPatentsLength = greenPatents.length
 			}

	     	if (yellowPatents.length === 0) {
 				vm.yellowPatentsLength = 0;
 			} else {
 				vm.yellowPatentsLength = yellowPatents.length
 			}

 			if(redPatents.length === 0) {
 				vm.redPatentsLength = 0;
 			} else {
 				vm.redPatentsLength = redPatents.length;
 			}

 			if(bluePatents.length === 0) {
 				vm.bluePatentsLength = 0;
 			} else {
 				vm.bluePatentsLength = bluePatents.length
 			}

 			if(brownPatents.length == 0) {
 				vm.brownPatentsLength = 0;
 			} else {
 				vm.brownPatentsLength = brownPatents.length
 			}


	  		vm.displayPhase = function(id) {
				switch (id) {
				    case 1:
				     	vm.patents = allPatents;
				        break;
				    case 2:
				     	vm.patents = greenPatents;
				        break;
				    case 3:
				     	vm.patents = yellowPatents;
				        break;
				    case 4:
				     	vm.patents = yellowPatents;
				        break;
				    case 5:
				     	vm.patents = bluePatents;
				     	break;
			     	case 6:
				    	vm.patents = brownPatents;
				}
			}



		}

	   	vm.sortType     = 'patentApplicationNumber'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order

		$scope.started = false;

		
      	function closeModals() {
	        if ($scope.warning) {
	          $scope.warning.close();
	          $scope.warning = null;
	        }

	        if ($scope.timedout) {
	          $scope.timedout.close();
	          $scope.timedout = null;
	        }
      	}


      	$scope.$on('IdleStart', function() {

        	closeModals();

        	$scope.warning = $uibModal.open({
          		templateUrl: 'warning-dialog.html',
          		windowClass: 'modal-danger'
    		});
      	});

	  	$scope.$on('IdleEnd', function() {
	    	closeModals();
	  	});

  		var userTimedOut = false;

      	$scope.$on('IdleTimeout', function() {
        	closeModals();

     		userTimedOut = true;  

	        if (userTimedOut) {
	        	$http.post('http://localhost:8080/p3sweb/resources/j_spring_security_logout')
	        	.then(
	        		function(){
		        		window.location.reload('http://localhost:8080/p3sweb/login');
	        		}    
	    		)    	
	        }

      	});

      	function getDate() {
      		$scope.date = new Date()
      	}

      	getDate();

      	vm.rowSelect = function(event){

      		if(!$(event.target).hasClass('cartbtn')) {
	      		var id = ($($(event.currentTarget).find('a')));
	      		var patentId = id[0].hash;
	      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
      		}
      	}
	}
});