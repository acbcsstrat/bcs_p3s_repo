app.component('checkout', {
	templateUrl: 'p3sweb/app/components/checkout/views/checkout.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', function(basketService, ngCart, fulfilmentProvider, $rootScope) {

		var vm = this;

		$rootScope.page = 'Basket';

		$scope.test = function() {
			console.log('hee')
		}

	}
]})


