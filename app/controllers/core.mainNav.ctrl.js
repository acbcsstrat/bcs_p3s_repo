angular.module('ppApp').controller('mainNavCtrl', mainNavCtrl);

mainNavCtrl.$inject = ['$scope', '$rootScope', '$mdSidenav', 'ngCart', '$timeout', 'coreService']

function mainNavCtrl($scope, $rootScope, $mdSidenav, ngCart,  $timeout, coreService){

	var vm = this;

 	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    // $scope.openGuide = openGuide;

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    // function openGuide() {
    // 	coreService.openAppGuide();
    // 	$rootScope.$broadcast('appGuideOpen');
    // }

	function welcomeMessageModal() {
		var modalInstance = $uibModal.open({
			templateUrl: 'app/templates/modals/modal.welcome-message.tpl.htm',
			scope: $scope,
			controllerAs:'$ctrl',
			controller: ['$uibModalInstance', function($uibModalInstance) {

		 	  	this.dismissWelcomeModal = function () {
			    	$uibModalInstance.close();
			  	};
			}]
		});
 	}    
    
};