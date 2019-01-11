angular.module('ppApp').component('basketnav', {
	templateUrl: 'app/templates/checkout/checkout.basket-nav.tpl.htm',
	controller: ['ngCart', '$timeout', 'moment', function(ngCart, $timeout, moment){

		var vm = this;

	    $timeout(function() {

        	vm.utcTime = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        	vm.estTime = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');
	      	vm.animate = true;      
	    }, 500);    

		vm.empty = function() {
			ngCart.empty();
		}

	}]
})