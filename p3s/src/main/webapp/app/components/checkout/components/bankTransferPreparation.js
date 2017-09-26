app.component('bankTransferPreparation', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: ['bankTransferCommitService', '$state','$scope', '$stateParams','$timeout', '$rootScope', function(bankTransferCommitService, $state, $scope, $stateParams, $timeout, $rootScope) {
		
		var vm = this;

		$rootScope.page = 'Confirm Order';

		vm.patentObj = $stateParams.patentObj;

		vm.commitTransfer = function() {
			
			var order = $stateParams.orderObj;
			order.totalCostUSD = $stateParams.patentObj.totalCostUSD;
			bankTransferCommitService.commitTransfer(order).then(
                    function(response){
                    	order = response.data;
                    	console.log(order)
                    },
                    function(errResponse){
                    	console.log("error response in prepa.js")
                        console.log(errResponse)
                    });	            
			}

	}
]})