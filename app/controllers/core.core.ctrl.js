angular.module('ppApp').controller('coreCtrl', coreCtrl);

coreCtrl.$inject = ['$uibModal', '$scope', 'dashboardService', 'localStorageService', '$timeout', 'patentsRestService', 'Idle', 'Keepalive', '$http', 'ngCart'];

function coreCtrl($uibModal, $scope, dashboardService, localStorageService, $timeout, patentsRestService, Idle, Keepalive, $http, ngCart) {

	var vm = this;

	var urgentResponse = [];
	var patentsFound = true;
	var displayMessages = displayMessages;
	var userTimedOut = false;
	fetchPatents();
	displayMessages();

	$scope.$on('IdleStart', function() {
		
	  	closeModals();

	  	$scope.warning = $uibModal.open({
			  templateUrl: 'app/templates/warning-dialog.html',
	  		windowClass: 'modal-danger'
	    });
	});

  	$scope.$on('IdleEnd', function() {
	  	closeModals();
	});

	$scope.$on('IdleTimeout', function() {

	  	closeModals();

	    userTimedOut = true;  

	    if (userTimedOut) {
	     	ngCart.empty();
	    	$http.post('http://localhost:8080/p3sweb/resources/j_spring_security_logout')
	      	.then(
	      		function(response){
	      		  window.location.reload('http://localhost:8080/p3sweb/login');
	      		},
	          	function(errResponse) {
	            	console.log(errResponse)
	          	}    
    		)    	
      	}

	});

	function fetchPatents() {

		patentsRestService.fetchAllPatents()
		.then(
			function(response){
				if(response.length === 0) {
					patentsFound = false;
				}
			},
			function(errResponse){
				console.log(errResponse)
			}
		)

	}

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/welcome-message-modal.tpl.htm',
			scope: $scope,
			controller: function($uibModalInstance) {

		 	  	$scope.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};
			}
		});
 	} //function systemMessageModal	

	function displayMessages() {

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

		    	},
		    	function(errResponse){
		    		console.log(errResponse);
		    	}
			);

			$timeout(function() {

			 	if(patentsFound === false) {
			 		console.log('hello')
			 		welcomeMessageModal();
				}

			}, 350);

		} //if end

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

	function urgentPatentModal(response) {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/urgent-message-modal.htm',
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

}