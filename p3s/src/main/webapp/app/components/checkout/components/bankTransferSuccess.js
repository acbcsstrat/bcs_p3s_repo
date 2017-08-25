app.component('bankTransferSuccess', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-success.htm',
	controller: function($state, $stateParams, $timeout) {

		var vm = this;
		var order = $stateParams.orderObj;

		console.log( order)

	}
})