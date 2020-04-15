export default angular.module('components.sidenav', []).component('sidenav', {

		template: require('html-loader!../html/sidenav.tpl.htm'),
		controller: ['$scope', '$rootScope', '$mdSidenav', '$timeout', 'userService', 'SidenavService',  'ngCart', 'coreService',  'moment', 'FxService', function($scope, $rootScope, $mdSidenav, $timeout, userService, SidenavService, ngCart, coreService, moment, FxService){

			var vm = this;

		 	vm.toggleLeft = buildToggler('left');
		    vm.toggleRight = buildToggler('right');
			vm.isOpen = isOpen;
	      	vm.toggleOpen = toggleOpen;
	      	vm.autoFocusContent = false;
	      	vm.menu = SidenavService;
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
		    	FxService.fetchFx()
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
}).name
