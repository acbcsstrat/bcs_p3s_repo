app.component('bankTransferSuccess', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-success.htm',
	controller: function($state, $scope,$stateParams, $timeout) {

		var vm = this;
		var order = $stateParams.orderObj;
		console.log($stateParams.orderObj)
		$scope.orderObj = $stateParams.orderObj;
		console.log("Success anytinme?????")
		

		console.log( order)

	}
})