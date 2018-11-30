app.controller('coreCtrl', ['$uibModal', '$scope', 'dashboardService', 'localStorageService', '$timeout', 'patentsRestService', 'Idle', 'Keepalive', '$http', 'ngCart', function($uibModal, $scope, dashboardService, localStorageService, $timeout, patentsRestService, Idle, Keepalive, $http, ngCart){

	var vm = this;

	var urgentResponse = [];

	var patentsFound = true;

	patentsRestService.fetchAllPatents()
	.then(
		function(response){
			if(response.length === 0) {
				patentsFound = false;
			}
		},
		function(errResponse){

		}
	)

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/app/views/modals/welcome-message-modal.htm',
			scope: $scope,
			controller: function($uibModalInstance) {

		 	  	$scope.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};
			}
		});
 	} //function systemMessageModal

	function urgentPatentModal(response) {
		var modalInstance = $uibModal.open({
			templateUrl: 'p3sweb/app/components/app/views/modals/urgent-message-modal.htm',
			scope: $scope,
			controller: function($uibModalInstance, message) {

				$scope.urgentPatents = message;

		 	  	$scope.urgentOk = function () {
			    	$uibModalInstance.close();
			  	};

			  	$scope.urgentDismissModal = function() {
			  		$uibModalInstance.dismiss();
			  	};

			},
			resolve: {
				message: function() {
					return urgentResponse;
				}
			}
		});
 	} //function urgentPatentModal

	var counter = localStorageService.get('counter');

 	if(counter === null) {

    	localStorageService.set('counter', 1);

    	counter = localStorageService.get('counter');

    	dashboardService.getMessages()
	    .then(
	    	function(response){

	    		var date = new Date().getTime();

    			if(response.urgentPatents.length > 0) {
	    			response.urgentPatents.forEach(function(data){
	    				urgentResponse.push(data);
	    			});

					$timeout(function() {
						urgentPatentModal(response);
					}, 500);
    			}


	    // 		if(response.systemMessages.length > 0) {
	    // 			response.systemMessages.forEach(function(data){
	    // 				var dateFrom = data.displayFromDate, dateTo = data.displayToDate;
	    // 				if(date > dateFrom && date < dateTo) { 
	    // 					systemResponse.push(data);
	    // 				}
	    // 			});

					// $timeout(function() {
					// 	systemMessageModal(response);
					// }, 500);

	    // 		}		    			

	    	},
	    	function(errResponse){
	    		console.log(errResponse);
	    	}
    	);

		$timeout(function() {
		 	if(patentsFound === false) {
		 		welcomeMessageModal();
			}	
		}, 350);
	}

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
	      ngCart.empty()
	    	$http.post('http://localhost:8080/p3sharness/resources/j_spring_security_logout')
	      	.then(
	      		function(response){
	      		  window.location.reload('http://localhost:8080/p3sharness/login');
	      		},
	          function(errResponse) {
	            console.log(errResponse)
	          }    
	    		)    	
	      }

	});	

}])