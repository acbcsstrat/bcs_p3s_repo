app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: function($stateParams, $state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http, patentsPhaseTabService, $rootScope, patentsService) {

		var vm = this;

		vm.testid = 1;

		vm.patentsTabs = {
			all: 1,
			green: 2,
			amber: 3,
			red: 4,
			blue: 5,
			black: 6
		}

		vm.$onInit = () => {

			vm.date = new Date()

			var patents = vm.patents;

			var greenProgress = [];
			var amberProgress = [];
			var redProgress = [];
			var blueProgress = [];
			var blackProgress = [];

			patents.forEach(function(item){
				patentsService.fetchCostAnalysis(item.id)
                .then(
                    function(response){

                        switch(item.costBandColour) {
                            case 'Green':

							var today = new Date().getTime();
							var start = new Date(response.greenStartDate);
							var end = new Date(response.amberStartDate);

							var total = end - start;
							var progress = today - start;

							item.progressBar =  Math.round(((progress) / (total)) * 100)                                  

                                break;
                            case 'Amber':

							var today = new Date().getTime();
							var start = new Date(response.amberStartDate);
							var end = new Date(response.redStartDate);

							var total = end - start;
							var progress = today - start;

							item.progressBar =  Math.round(((progress) / (total)) * 100)                            

                                break;
                            case 'Red':

							var today = new Date().getTime();
							var start = new Date(response.redStartDate);
							var end = new Date(response.blueStartDate);

							var total = end - start;
							var progress = today - start;

							item.progressBar =  Math.round(((progress) / (total)) * 100)

                                break;
                            case 'Blue':

							var today = new Date().getTime();
							var start = response.blueStartDate;
							var end = response.blackStartDate;

							var total = end - start;
							var progress = today - start;

							item.progressBar =  Math.round(((progress) / (total)) * 100)

                                break;
                            case 'Black':

							var today = new Date().getTime();
							var start = response.blackStartDate;
							var end = response.blackEndDate;

							var total = end - start;
							var progress = today - start;

							item.progressBar =  Math.round(((progress) / (total)) * 100)

							// console.log(item.progressBar)

                        }
        
                    }, 
                    function(errResponse){
                        console.log('no')
                    }
                )

				switch(item.costBandColour) {
				    case 'Green':
				    	greenProgress.push(item)
				        break;
				    case 'Amber':
				    	amberProgress.push(item)				
				        break;
				    case 'Red':
				    	redProgress.push(item)				   
				        break;
				    case 'Blue':
				    	blueProgress.push(item)
				        break;
				    case 'Black':
						blackProgress.push(item)
			     	
				}

			})

			var allPatents = [];
			var greenPatents = [];
			var amberPatents = [];
			var redPatents = [];
			var bluePatents = [];
			var blackPatents = [];

	     	patents.forEach(function(item){

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

	     		if(item.costBandColour == 'Amber') {
	     			amberPatents.push(item)
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

	     		if(item.costBandColour == 'Black') {
	     			blackPatents.push(item)
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

	     	if (amberPatents.length === 0) {
 				vm.amberPatentsLength = 0;
 			} else {
 				vm.amberPatentsLength = amberPatents.length
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

 			if(blackPatents.length == 0) {
 				vm.blackPatentsLength = 0;
 			} else {
 				vm.blackPatentsLength = blackPatents.length
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
				     	vm.patents = amberPatents;
				        break;
				    case 4:
				     	vm.patents = redPatents;
				        break;
				    case 5:
				     	vm.patents = bluePatents;
				     	break;
			     	case 6:
				    	vm.patents = blackPatents;
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