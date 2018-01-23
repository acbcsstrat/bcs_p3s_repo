app.component('bankTransferSuccess', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-success.htm',
	controller: ['$scope', '$rootScope', '$stateParams' ,function($scope, $rootScope, $stateParams) {

		$rootScope.page = 'Bank Transfer Details';

		$scope.orderObj = $stateParams.orderObj;	

	}
]});