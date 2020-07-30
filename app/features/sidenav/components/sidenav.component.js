export default angular.module('components.sidenav', []).component('sidenav', {
		template: require('html-loader!../html/sidenav.tpl.htm'),
		controller: ['$scope', '$rootScope', '$mdSidenav', '$timeout', '$http', 'ProfileService', 'SidenavService',  'ngCart', 'moment', 'FxService', function($scope, $rootScope, $mdSidenav, $timeout, $http, ProfileService, SidenavService, ngCart, moment, FxService){

		var vm = this;

	 	vm.toggleLeft = buildToggler('left');
	    vm.toggleRight = buildToggler('right');
	    // vm.openGuide = openGuide;
		vm.isOpen = isOpen;
      	vm.toggleOpen = toggleOpen;
      	vm.autoFocusContent = false;
      	vm.menu = SidenavService;
      	vm.status = {
        	isFirstOpen: true,
        	isFirstDisabled: false
      	};
      	console.log('whattttttttt')

        vm.utc = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        vm.est = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');

      	$rootScope.$on('refreshAvatar', function(){
	        var timestamp = new Date().getTime();
	        vm.avatarimage = '../avatar-image/' + '?' + timestamp;
      	})

      	function init() {

      		$http.get('../avatar-image/')
      		.then(
      			function(response){
      				if(response.data !== '') {
      					vm.avatarimage = '../avatar-image/';
      				}
      			}
      		)

			ProfileService.fetchUser()
			.then(
				function(response){
					vm.user = response;
				}
			)
	    	FxService.fetchFx()
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
}).name
