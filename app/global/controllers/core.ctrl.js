import CoreService from '../services/app.core.serv.js';
import CasesRestService from '../../features/portfolio/services/portfolio.cases.serv.js';

export default angular.module('ppApp.core', [CoreService, CasesRestService]).controller('coreCtrl', coreCtrl).name

coreCtrl.$inject = ['$uibModal', '$scope', '$state', '$timeout', '$http', '$cookies', '$location', '$rootScope','CoreService', 'localStorageService', 'ngCart', 'CasesRestService', 'Idle', 'Keepalive',  'AuthorisationService'];

function coreCtrl($uibModal, $scope,  $state, $timeout, $http, $cookies, $location, $rootScope, CoreService, localStorageService, ngCart,  CasesRestService, Idle, Keepalive,  AuthorisationService) {

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
		  	template: require('html-loader!../html/modals/modal.idle.tpl.htm'),
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
    	$http.post(ppdomain+'resources/j_spring_security_logout')
      	.then(
      		function(response){
	            AuthorisationService.ClearCredentials()      			
  				$state.go('login', { reload: false })

      		},
          	function(errResponse) {
            	console.error('Error with idle timeout. Error: ', errResponse);
          	}    
		)
      	
	});

    function init() {
    	$timeout(function(){
	        if($scope.firstTime) {
	            welcomeMessageModal()
	        }
    	}, 300)

    }

    init();

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			template: require('html-loader!../html/modals/modal.welcome-message.tpl.htm'),
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