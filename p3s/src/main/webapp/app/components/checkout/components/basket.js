app.component('basket', {
	templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', '$state',  '$scope', function(basketService, ngCart, fulfilmentProvider, $rootScope, $state, $scope) {

		var vm = this;

		// if(ngCart.getTotalItems() === 0) {
		// 	ngCart.removeItem()
		// }

		// vm.refresh = function() {
		// 	console.log('hello')
		// }

		// 	var cartItems = ngCart.$cart.items;
		// 	var processingFeeArr = [];
		// 	var renewalFeeArr = [];
		// 	var extensionFeeArr = [];
		// 	var urgentFeeArr = [];

		// 	console.log('removed')
		// 	vm.processingFee = 0;
		// 	vm.renewalFee = 0;
		// 	vm.extensionFee = 0;
		// 	vm.urgentFee = 0;


		// 	processingFeeArr.forEach(function(data, i){
		// 		vm.processingFee += data;
		// 	})
		// 	renewalFeeArr.forEach(function(data, i){
		// 		vm.renewalFee += data;
		// 	})
		// 	extensionFeeArr.forEach(function(data, i){
		// 		vm.extensionFee += data;
		// 	})
		// 	urgentFeeArr.forEach(function(data, i){
		// 		vm.urgentFee += data;
		// 	})		

		// 	cartItems.forEach(function(data, i){
		// 	processingFeeArr.push(data._data.feeUI.processingFeeUSD)
		// 	renewalFeeArr.push(data._data.feeUI.renewalFeeUSD)
		// 	extensionFeeArr.push(data._data.feeUI.extensionFeeUSD)
		// 	urgentFeeArr.push(data._data.feeUI.urgentFeeUSD)
		// })




		$rootScope.page = 'Basket';

	}
]})


