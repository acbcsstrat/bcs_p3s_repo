angular.module('ppApp').component('basketnav', {
	templateUrl: 'app/templates/checkout/checkout.basket-nav.tpl.htm',
	controller: ['ngCart', '$timeout', 'moment', function(ngCart, $timeout, moment){

		var vm = this;

	    vm.animate = false;

	    $timeout(function() {
	      	vm.animate = true;
        	vm.utcTime = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        	vm.estTime = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');	      
	    }, 300);    

		vm.empty = function() {
			ngCart.empty();
		}

	}]
})