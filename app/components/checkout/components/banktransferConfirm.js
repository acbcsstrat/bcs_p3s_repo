app.component('banktransferConfirm', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: ['$state', '$stateParams', '$timeout', function($state, $stateParams, $timeout) {

		var vm = this;
		var orderDetails = $stateParams.order;

		vm.finalizeOrder = function(order) {
            $timeout(function() {
                $state.go('banktransfer-finalise', {order: orderDetails});
            }, 200);
		};

	}
]});