angular.module('ppApp').controller('bankTransferPrepCtrl', bankTransferPrepCtrl);

bankTransferPrepCtrl.$inject = ['bankTransferCommitService', '$state', '$scope', '$stateParams', '$rootScope', '$uibModal', 'ngCart']

function bankTransferPrepCtrl(bankTransferCommitService, $state, $scope, $stateParams, $rootScope, $uibModal, ngCart) {

	var vm = this;

	$rootScope.page = 'Confirm Order';
	
	vm.patentObj = $stateParams.patentObj;	
	//object passed as a params through app/assets/js/gCart.fulfilment.js
	if(vm.patentObj === null) { //if page is refreshed when on bank prepration page
		$state.go('patents'); //direct user to patents
	} else {

		var order = $stateParams.orderObj;

		vm.openCancelTransModal = openCancelTransModal;
		vm.commitTransfer = commitTransfer;
		order.totalCostUSD = $stateParams.patentObj.totalCostUSD;		

		function openCancelTransModal() {

			var modalInstance = $uibModal.open({
				templateUrl: 'p3sweb/app/components/checkout/views/modals/modal-cancel-transaction.htm',
				appendTo: undefined,
				controller: function($uibModalInstance, $scope) {

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

		function commitTransfer() {
			
			vm.commitTransferBtn = true; //prevent double click

			bankTransferCommitService.commitTransfer(order)
			.then(
	            function(response){
	            	order = response.data;
	            },
	            function(errResponse){
	            	if(errResponse) {
						var modalInstance = $uibModal.open({
							templateUrl: 'p3sweb/app/components/checkout/views/modals/modal-commit-error.htm',
							appendTo: undefined,
							controller: function($uibModalInstance, $scope) {

							  	$scope.dismissModal = function () {
							    	$uibModalInstance.close();
							  	};

							  	$scope.cancel = function() {
							  		$uibModalInstance.dismiss('cancel');
							  	};
							}
						});
					}
	            }
	        );	            
		};
	}
}