app.component('bankTransferPreparation', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: function($state, $stateParams, $timeout, basketService) {

		var vm = this;

		// console.log(basketService.fetchBasketPatents())

		console.log($stateParams.patentObj.totalCostUSD)

		vm.finalizeOrder = function() {
			var order = $stateParams.orderObj;
            $timeout(function() {
                $state.go('bank-transfer-success', {orderObj: order})
            }, 200);
		}

	}
})