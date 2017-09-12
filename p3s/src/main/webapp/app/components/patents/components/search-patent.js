app.component('searchpatent', {
	templateUrl: 'p3sweb/app/components/patents/views/search-patent.htm',
	controller: ['searchPatentService', '$state', '$stateParams', '$timeout', '$rootScope', 'patentsService',function(searchPatentService, $state, $stateParams, $timeout, $rootScope, patentsService) {

		var vm = this;
	 	vm.queriedPatent = {};

		vm.patentNotifications = {
			green: 'Green',
			yellow: 'Amber',
			red: 'Red',
			blue: 'Blue',
			black: 'Black'
		}

		vm.displayNotifications = function(phase) {
			function phaseNotifications(phase) {

				var notificationsArr = vm.queriedPatent.notificationUIs;
		  		var notifications = [];
		  		console.log(phase)
	  			
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
        	
    		vm.chunkedData = chunk(phaseNotifications(phase), 3);

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
	    	patentsService.savePatent(patent)
	            .then(function(){
	             	$state.go('patents', {}, {reload: true})
	             	.then(function(){
		             		$timeout(function(){patentsService.fetchAllPatents()}, 400);
		             	})
		             },
		            function(errResponse){
		                console.error('Error while deleting Patent');
		            }
    	)};
             	
        vm.cancelSearch = function() {
        	$state.go('search-patent', {}, {reload: true});
        }
	}

]});




