app.component('basket', {
	templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', function(basketService, ngCart, fulfilmentProvider, $rootScope) {

		var vm = this;

		$rootScope.page = 'Basket'

	}
]})


