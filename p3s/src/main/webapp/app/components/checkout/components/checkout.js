app.component('checkout', {
	templateUrl: 'p3sweb/app/components/checkout/views/checkout.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', function(basketService, ngCart, fulfilmentProvider, $rootScope) {

		var vm = this;

		vm.$onInit = function() {
			console.log('hello')
		}

		console.log(ngCart)

		var cartItems = ngCart.$cart.items;
		var processingFeeArr = [];
		var renewalFeeArr = [];
		var extensionFeeArr = [];
		var urgentFeeArr = [];

		vm.processingFee = 0;
		vm.renewalFee = 0;
		vm.extensionFee = 0;
		vm.urgentFee = 0;
		
		cartItems.forEach(function(data, i){
			processingFeeArr.push(data._data.feeUI.processingFeeUSD)
			renewalFeeArr.push(data._data.feeUI.renewalFeeUSD)
			extensionFeeArr.push(data._data.feeUI.extensionFeeUSD)
			urgentFeeArr.push(data._data.feeUI.urgentFeeUSD)
		})

		processingFeeArr.forEach(function(data, i){
			vm.processingFee += data;
		})
		renewalFeeArr.forEach(function(data, i){
			vm.renewalFee += data;
		})
		extensionFeeArr.forEach(function(data, i){
			vm.extensionFee += data;
		})
		urgentFeeArr.forEach(function(data, i){
			vm.urgentFee += data;
		})

					

		$rootScope.page = 'Basket';

	}
]})


