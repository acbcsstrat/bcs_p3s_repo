angular.module('ppApp').component('mainnav', {
	templateUrl: 'app/templates/nav/nav.main-nav.tpl.htm',
	controller: ['userService', 'mainNavService', '$scope', '$rootScope', '$mdSidenav', 'ngCart', 'coreService', '$timeout', 'moment', 'fxService', function(userService, mainNavService, $scope, $rootScope, $mdSidenav, ngCart, coreService, $timeout, moment, fxService){

		var vm = this;

	 	vm.toggleLeft = buildToggler('left');
	    vm.toggleRight = buildToggler('right');
	    // vm.openGuide = openGuide;
		vm.isOpen = isOpen;
      	vm.toggleOpen = toggleOpen;
      	vm.autoFocusContent = false;
      	vm.menu = mainNavService;
      	vm.status = {
        	isFirstOpen: true,
        	isFirstDisabled: false
      	};
	    
      	function init() {

			userService.fetchUser()
			.then(
				function(response){
					vm.user = response;
				},
				function(errResponse){
					console.log(errResponse)
				}
			)
	    	fxService.fetchFx()
	    	.then(
	    		function(response){
	    			vm.fxRate = response.currentFXRate.rate
	    		},
	    		function(errResponse){
	    			console.log(errResponse)
	    		}
	    	)	

		    $timeout(function() {
		    	timeZoneClocks();
		    	vm.timeLoaded = true;   
		    })	    	

      	}


      	init()

      	function isOpen(section) {
        	return vm.menu.isSectionSelected(section);
      	}
      	function toggleOpen(section) {
        	vm.menu.toggleSelectSection(section);
      	}


	    function buildToggler(componentId) {
	      	return function() {
	        	$mdSidenav(componentId).toggle();
	      	};
	    }

	    function timeZoneClocks() {

	        var utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
	        var est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
	    
	        var t = $timeout(function() {
	            vm.utcTime = utc;
	            vm.estTime =  est;
	            timeZoneClocks()
	        }, 500);

	    }

		vm.empty = function() {
			ngCart.empty();
		}    

	    // function openGuide() {
	    // 	coreService.openAppGuide();
	    // 	$rootScope.$broadcast('appGuideOpen');
	    // }

		// function welcomeMessageModal() {
		// 	var modalInstance = $uibModal.open({
		// 		templateUrl: 'app/templates/modals/modal.welcome-message.tpl.htm',
		// 		scope: $scope,
		// 		controllerAs:'$ctrl',
		// 		controller: ['$uibModalInstance', function($uibModalInstance) {

		// 	 	  	this.dismissWelcomeModal = function () {
		// 		    	$uibModalInstance.close();
		// 		  	};
		// 		}]
		// 	});
	 // 	}    


	}]
	
})