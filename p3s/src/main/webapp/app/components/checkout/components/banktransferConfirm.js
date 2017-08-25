app.component('banktransferConfirm', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: function($state, $stateParams, $timeout) {

		var vm = this;
		var order = $stateParams.order;

		vm.finalizeOrder = function(order) {
            $timeout(function() {
                $state.go('banktransfer-finalise', {order: order})
            }, 200);
		}

	}
})