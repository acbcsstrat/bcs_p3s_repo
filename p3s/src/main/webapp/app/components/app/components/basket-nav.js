app.component('basketnav', {
	templateUrl: 'p3sweb/app/components/app/views/basket-nav.htm',
	controller: ['ngCart', function(ngCart){

			var vm = this;

			vm.empty = function() {
				ngCart.empty();
			}

	}]
})