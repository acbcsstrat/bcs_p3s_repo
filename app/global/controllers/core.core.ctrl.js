import coreService from '../../app/services/app.core.serv.js';
import PatentsRestService from '../../app/services/patents.patentsRest.serv.js';

export default angular.module('ppApp.core', [coreService, PatentsRestService]).controller('coreCtrl', coreCtrl).name

coreCtrl.$inject = ['$uibModal', '$scope', 'coreService', 'localStorageService', '$timeout', 'PatentsRestService', 'Idle', 'Keepalive', '$http', '$cookies'];

function coreCtrl($uibModal, $scope, coreService, localStorageService, $timeout, PatentsRestService, Idle, Keepalive, $http, $cookies) {

	var vm = this;

	var urgentResponse = [];
	var systemResponse = [];
	var patentsFound = true;
	var userTimedOut = false;
	var messageArr = [];

	$scope.$on('Keepalive', function() {
		$http.get(ppdomain+'keep-session-alive/');
	});

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


        PatentsRestService.fetchAllPatents()
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