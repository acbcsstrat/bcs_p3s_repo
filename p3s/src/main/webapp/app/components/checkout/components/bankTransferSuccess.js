app.component('bankTransferSuccess', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-success.htm',
	controller: ['$scope', '$rootScope', '$stateParams' ,function($scope, $rootScope, $stateParams) {

		var vm = this;
		var order = $stateParams.orderObj;

		$rootScope.page = 'Bank Transfer Details';

		$scope.orderObj = $stateParams.orderObj;

		
		
		console.log($scope.orderObj)

	}
]})