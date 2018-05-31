angular.module('ppApp').controller('coreCtrl', coreCtrl);

coreCtrl.$inject = ['$uibModal', '$scope', 'dashboardService', 'localStorageService', '$timeout', 'patentsRestService', 'Idle', 'Keepalive', '$http', 'ngCart'];

function coreCtrl($uibModal, $scope, dashboardService, localStorageService, $timeout, patentsRestService, Idle, Keepalive, $http, ngCart) {

	var vm = this;

	var urgentResponse = [];
	var systemResponse = [];
	var patentsFound = true;
	var userTimedOut = false;
	// vm.checkedMessages = checkedMessages;
	// vm.supresssMessages = supresssMessages;
	var messageArr = [];

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

	fetchPatents();

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modal.welcome-message.tpl.htm',
			scope: $scope,
			controller: ['$uibModalInstance', function($uibModalInstance) {

		 	  	$scope.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};
			}]
		});
 	}

	function displayMessages() {

		var counter = localStorageService.get('counter');

		if(counter === null) {

			localStorageService.set('counter', 1);

			counter = localStorageService.get('counter');

			dashboardService.getMessages()
		    .then(
		    	function(response){

		    		var date = new Date().getTime();

		    		 if(response.systemMessages.length > 0) {

			            response.systemMessages.forEach(function(data){
			                var dateFrom = data.displayFromDate; dateTo = data.displayToDate;
			                if(date > dateFrom && date < dateTo) {
			                	console.log(data)
			                    systemResponse.push(data)
			                }
			            })



			            $timeout(function() {
			                systemMessageModal()    
			            }, 1000);

			        } //if end

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
			 		welcomeMessageModal();
				}

			}, 350);

		} //if end

	}

	displayMessages();
	
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

    function systemMessageModal() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modal.system-message.tpl.htm',
            scope: $scope,
            appendTo: undefined,
            controller: ['$uibModalInstance', 'message', function($uibModalInstance, message) {

                open = true;

                $scope.systemMessage = {
                	message:  message
                }

                $scope.systemOk = function () {
                    $uibModalInstance.close();
                };

				$scope.checkedMessages = function(id, checked) {
					if(checked) {
						messageArr.push(id)
						$scope.message = true;
					} else {
						messageArr.splice(-1, 1)
					}

					if(messageArr.length == 0) {
						$scope.message = false;				
					}

				}

				$scope.supresssMessages = function() {
					dashboardService.supressMessages(messageArr)
				} 	                

            }],
            resolve: {
                message: function() {
                    return systemResponse;
                }
            }
        });

    }; //function end

	function urgentPatentModal(response) {

		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modal.urgent-message.tpl.htm',
			scope: $scope,
			appendTo: undefined,
			controller: ['$uibModalInstance', 'message', function($uibModalInstance, message) {

				$scope.urgentPatents = message;

		 	  	$scope.urgentOk = function () {
			    	$uibModalInstance.close();
			  	};

			  	$scope.urgentDismissModal = function() {
			  		$uibModalInstance.dismiss();
			  	};

			}],
			resolve: {
				message: function() {
					return urgentResponse;
				}
			}
		});
 	} //function urgentPatentModal

}