angular.module('ppApp').component('mainnav', {
	templateUrl: 'app/templates/nav/nav.main-nav.tpl.htm',
	controller: ['userService', 'mainNavService', '$scope', '$rootScope', '$mdSidenav', 'ngCart', 'coreService', '$timeout', 'moment', 'fxService', '$rootScope', '$http', function(userService, mainNavService, $scope, $rootScope, $mdSidenav, ngCart, coreService, $timeout, moment, fxService, $rootScope, $http){

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


        vm.utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        vm.est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');

      	$rootScope.$on('refreshAvatar', function(){
	        var timestamp = new Date().getTime();
	        vm.avatarimage = '../p3sweb/avatar-image/' + '?' + timestamp;
      	})

      	function init() {

      		$http.get('../p3sweb/avatar-image/')
      		.then(
      			function(response){
      				if(response.data !== '') {
      					vm.avatarimage = '../p3sweb/avatar-image/';
      				}
      			}
      		)

			userService.fetchUser()
			.then(
				function(response){
					vm.user = response;
				}
			)
	    	fxService.fetchFx()
	    	.then(
	    		function(response){
	    			vm.fxRate = response.currentFXRate.rate
	    		},
	    		function(errResponse){
	    			console.error('Error fetching fx: ', errResponse)
	    		}
	    	)	

		    setInterval(function() {
		    	timeZoneClocks();
		    }, 1000)

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
	        vm.utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
	        vm.est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
	    }

		vm.empty = function() {
			ngCart.empty();
		}

	}]
	
})