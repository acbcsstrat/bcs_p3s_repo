app.component('bankTransferPreparation', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: ['bankTransferCommitService', '$state','$scope', '$stateParams','$timeout',function(bankTransferCommitService, $state, $scope, $stateParams, $timeout) {
		
		var vm = this;

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