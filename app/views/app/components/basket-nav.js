angular.module('ppApp').component('basketnav', {
	templateUrl: 'p3sweb/app/views/app/views/basket-nav.htm',
	controller: ['ngCart', '$timeout', function(ngCart, $timeout){

		var vm = this;

	    vm.animate = false;

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);    

		vm.empty = function() {
			ngCart.empty();
		}

	}]
})