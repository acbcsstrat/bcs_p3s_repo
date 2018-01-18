app.component('bankTransferPreparation', {
	templateUrl: 'p3sweb/app/components/checkout/views/bank-transfer-preparation.htm',
	controller: ['bankTransferCommitService', '$state','$scope', '$stateParams','$timeout', '$rootScope', '$uibModal', 'ngCart', function(bankTransferCommitService, $state, $scope, $stateParams, $timeout, $rootScope, $uibModal, ngCart) {
		
		var vm = this;

		$rootScope.page = 'Confirm Order';

		vm.patentObj = $stateParams.patentObj;

		vm.openCancelTransModal = function() {

			var modalInstance = $uibModal.open({
				templateUrl: 'p3sweb/app/components/checkout/views/modals/modal-cancel-transaction.htm',
				appendTo: undefined,
				controller: function($uibModalInstance ,$scope) {

				  	$scope.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};

				  	$scope.cancelTrans = function () {
				  		ngCart.empty();
				    	$uibModalInstance.close();
				    	$state.go('patents');
				  	};

				  	$scope.cancel = function() {
				  		$uibModalInstance.dismiss('cancel');
				  	};
				}
			});
		};

		vm.commitTransfer = function() {
			
			vm.commitTransferBtn = true;

			var order = $stateParams.orderObj;
			order.totalCostUSD = $stateParams.patentObj.totalCostUSD;
			bankTransferCommitService.commitTransfer(order)
				.then(
	                function(response){
	                	order = response.data;
	                },
	                function(errResponse){

	                }
	            );	            
		};

	}
]});