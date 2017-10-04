app.component('searchpatent', {
	templateUrl: 'p3sweb/app/components/patents/views/search-patent.htm',
	controller: ['searchPatentService', '$state', '$stateParams', '$timeout', '$rootScope', 'patentsRestService', '$timeout', function(searchPatentService, $state, $stateParams, $timeout, $rootScope, patentsRestService, $timeout) {

		var vm = this;
	 	vm.queriedPatent = {};

	 	$rootScope.page = 'Add Patent';

		vm.patentNotifications = {
			green: 'Green',
			amber: 'Amber',
			red: 'Red',
			blue: 'Blue',
			black: 'Black'
		}

		vm.colourKey = function(colour) {
			switch(colour) {
				case 0:
					vm.colourPhaseTitle = {
						title: 'Green',
						descrip: 'lorem',
						color: '#53ab58'
					}
				break;
				case 1:
					vm.colourPhaseTitle = {
						title: 'Amber',
						descrip: 'loremmm',
						color: '#f9b233'						
					}
				break;
				case 2:
					vm.colourPhaseTitle = {
						title: 'Red',
						descrip: 'lorem ipsum',
						color: '#e30613'
					}
				break;
				case 3:
					vm.colourPhaseTitle = {
						title: 'Blue',
						descrip: '24 Week Extension',
						color: '#0097ce'					
					}
				break;
				case 4:
					vm.colourPhaseTitle = {
						title: 'Black',
						descrip: 'herisuhimas',
						color: '#3c3c3b'
					}
			}
		}

		vm.displayNotifications = function(phase) {

			console.log(phase)

			function phaseNotifications(phase) {
				
				var notificationsArr = vm.queriedPatent.notificationUIs;
		  		var notifications = [];
	  			
		  		notificationsArr.forEach(function(data){
		  			if(data.costbandcolor == phase) {
		  				notifications.push(data)
		  			}
		  		})

		  		return notifications;

		  	}
		  
        	var newArr = [];

        	function chunk(arr, size) {
        		for (i=0; i < arr.length; i+=size) {
	        		newArr.push(arr.slice(i, i+size));
	        	}
	        	return newArr;
        	}  	
        	
        	$timeout(function() {
    			vm.chunkedData = chunk(phaseNotifications(phase), 3);
    			vm.colourPhase = phase;
    		}, 100)
		}


		vm.findPatent = function(patentNo) {
			
			searchPatentService.findPatent(patentNo)
			.then(
				function(data) {
					vm.queriedPatent = data;
					vm.displayNotifications(vm.patentNotifications.green)
				},
				function(errResponse) {
					console.error('Error while finding patent');
				}
			);
        }

	 	vm.submit = function(patent) {
	 		console.log(patent)
	 		$timeout(function(){
				patentsRestService.savePatent(patent)
		            .then(function(){
		             	$state.go('patents', {}, {reload: true})
		             	.then(function(){
			             		$timeout(function(){patentsRestService.fetchAllPatents()}, 400);
			             	})
			             },
			            function(errResponse){
			                console.error('Error while deleting Patent');
			            }
	    		)
	 		}, 100);
	    	
    		};
             	
        vm.cancelSearch = function() {
        	$state.go('search-patent', {}, {reload: true});
        }
	}

]});




