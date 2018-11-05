angular.module('ppApp').component('basketnav', {
	templateUrl: 'app/templates/checkout/checkout.basket-nav.tpl.htm',
<<<<<<< HEAD
	controller: ['ngCart', '$timeout', function(ngCart, $timeout){
=======
	controller: ['ngCart', '$timeout', 'moment', function(ngCart, $timeout, moment){
>>>>>>> origin/fe-branch-v2.2

		var vm = this;

	    vm.animate = false;

	    $timeout(function() {
<<<<<<< HEAD
	      vm.animate = true;
=======
	      	vm.animate = true;
        	vm.utcTime = moment.tz("Etc/UTC").format('HH:mm MM/DD/YYYY');
        	vm.estTime = moment.tz("America/New_York").format('HH:mm MM/DD/YYYY');	      
>>>>>>> origin/fe-branch-v2.2
	    }, 300);    

		vm.empty = function() {
			ngCart.empty();
		}

	}]
})