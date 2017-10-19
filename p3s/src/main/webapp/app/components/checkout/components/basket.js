app.component('basket', {
	templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', '$state',  '$scope', function(basketService, ngCart, fulfilmentProvider, $rootScope, $state, $scope) {

		var vm = this;

		$rootScope.page = 'Basket';

	}
]})


