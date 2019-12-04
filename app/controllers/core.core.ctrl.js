angular.module('ppApp').controller('coreCtrl', coreCtrl);

coreCtrl.$inject = ['$uibModal', '$scope', 'coreService', 'localStorageService', '$timeout', 'patentsRestService', 'Idle', 'Keepalive', '$http', 'ngCart', 'coreService', 'organiseColourService', '$cookies'];

function coreCtrl($uibModal, $scope, coreService, localStorageService, $timeout, patentsRestService, Idle, Keepalive, $http, ngCart, coreService, organiseColourService, $cookies) {

	var vm = this;

	var urgentResponse = [];
	var systemResponse = [];
	var patentsFound = true;
	var userTimedOut = false;
	var messageArr = [];

	$scope.$on('IdleStart', function() {
		
	  	closeModals();

	  	$scope.warning = $uibModal.open({
		  	templateUrl: 'app/templates/modals/modal.idle.tpl.htm',
	  		windowClass: 'modal-danger',
			appendTo: undefined
	    });
	});

  	$scope.$on('IdleEnd', function() {
	  	closeModals();
	});

	$scope.$on('IdleTimeout', function() {

	  	closeModals();

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
      	
	});

    function init() {

        patentsRestService.fetchAllPatents()
        .then(
            function(response){
                if(response.length === 0) {
                    welcomeMessageModal();
                }
            },
            function(errResponse){
                console.log(errResponse)
            }
        )

    }

    init();

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.welcome-message.tpl.htm',
			scope: $scope,
			controllerAs:'$ctrl',
			controller: ['$uibModalInstance', function($uibModalInstance) {

		 	  	this.dismissModal = function () {
			    	$uibModalInstance.close();
			  	};
			}]
		});
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

}