import CoreService from '../services/app.core.serv.js';
import CasesRestService from '../../features/portfolio/services/portfolio.cases.serv.js';

export default angular.module('ppApp.core', [CoreService, CasesRestService]).controller('coreCtrl', coreCtrl).name

coreCtrl.$inject = ['$uibModal', '$scope', '$timeout', '$http', '$cookies', 'CoreService', 'localStorageService', 'ngCart', 'CasesRestService', 'Idle', 'Keepalive'];

function coreCtrl($uibModal, $scope, $timeout, $http, $cookies, CoreService, localStorageService, ngCart,  CasesRestService, Idle, Keepalive) {

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
    	$http.post('http://localhost:8080/p3sweb/resources/j_spring_security_logout')
      	.then(
      		function(response){
      		  	window.location.reload('http://localhost:8080/p3sweb/login');
      		},
          	function(errResponse) {
            	console.error('Error with idle timeout. Error: ', errResponse);
          	}    
		)    	
      	
	});

    function init() {


        CasesRestService.fetchAllCases()
        .then(
            function(response){
                if(response.length === 0) {
                    welcomeMessageModal();
                }
            },
            function(errResponse){
                console.log(errResponse);
            }
        )

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