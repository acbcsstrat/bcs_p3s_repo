angular.module('ppApp').component('mainnav', {
	templateUrl: 'app/templates/nav/nav.main-nav.tpl.htm',
	controller: ['userService', 'mainNavService', '$scope', '$rootScope', '$mdSidenav', 'ngCart', 'coreService', '$timeout', 'moment',  function(userService, mainNavService, $scope, $rootScope, $mdSidenav, ngCart, coreService, $timeout, moment){

		var vm = this;

		userService.fetchUser()
		.then(
			function(response){
				vm.user = response;
			},
			function(errResponse){
				console.log(errResponse)
			}
		)
		vm.isOpen = isOpen;
      	vm.toggleOpen = toggleOpen;
      	vm.autoFocusContent = false;
      	vm.menu = mainNavService;
      	vm.status = {
        	isFirstOpen: true,
        	isFirstDisabled: false
      	};

      	function isOpen(section) {
        	return vm.menu.isSectionSelected(section);
      	}
      	function toggleOpen(section) {
        	vm.menu.toggleSelectSection(section);
      	}

	 	vm.toggleLeft = buildToggler('left');
	    vm.toggleRight = buildToggler('right');

	    vm.openGuide = openGuide;

	    function buildToggler(componentId) {
	      	return function() {
	        	$mdSidenav(componentId).toggle();
	      	};
	    }

	    $timeout(function() {
	    	vm.utcTime = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
	    	vm.estTime = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
	    	vm.timeLoaded = true;
	    });    

		vm.empty = function() {
			ngCart.empty();
		}    

	    function openGuide() {
	    	coreService.openAppGuide();
	    	$rootScope.$broadcast('appGuideOpen');
	    }

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


	}]
	
})