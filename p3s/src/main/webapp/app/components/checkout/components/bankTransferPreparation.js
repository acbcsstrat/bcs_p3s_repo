app.component('bankTransferPreparation', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	//controller: function($state, $scope, $stateParams, $timeout, basketService, bankTransferCommitService) {
	controller: ['bankTransferCommitService', '$state','$scope', '$stateParams','$timeout',function(bankTransferCommitService, $state, $scope, $stateParams, $timeout) {
		
		console.log("comes here")
		console.log($stateParams)
		$scope.orderObj = $stateParams.orderObj;
		$scope.patentObj = $stateParams.patentObj;
		console.log($scope.orderObj );
		console.log($scope.patentObj);
		var vm = this;

		vm.commitTransfer = function() {
			

			var order = $stateParams.orderObj;
			order.totalCostUSD = $stateParams.patentObj.totalCostUSD;
			console.log("Anytime here")
			bankTransferCommitService.commitTransfer(order).then(
                    function(response){
                    	console.log("Now here")
                    	console.log(response.data)
                    	order = response.data;
                    },
                    function(errResponse){
                    	console.log("error response in prepa.js")
                        console.log(errResponse)
                    });
			
			
        	/*$timeout(function() {
                $state.go('bank-transfer-success', {orderObj: order})
            }, 200);*/

	            
			}

	}
]})