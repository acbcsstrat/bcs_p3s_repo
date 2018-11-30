angular.module('ppApp').controller('bankTransferPrepCtrl', bankTransferPrepCtrl);

bankTransferPrepCtrl.$inject = ['bankTransferCommitService', '$state', '$scope', '$stateParams', '$rootScope', '$uibModal', 'ngCart']

function bankTransferPrepCtrl(bankTransferCommitService, $state, $scope, $stateParams, $rootScope, $uibModal, ngCart) {

	var vm = this;

	$rootScope.page = 'Confirm Order';

	vm.orderObj = $stateParams.orderObj;
	console.log(vm.orderObj )
	if(vm.orderObj == '') { //if page is refreshed when on bank prepration page
		$state.go('portfolio', {reload: true}); //direct user to patents
	} else {

		vm.orderObj.patentNos = (function(){
			return vm.orderObj.orderedPatentUIs.map(function(el) {
				return el.ep_ApplicationNumber;
			})
		}())

		vm.openCancelTransModal = openCancelTransModal;
		vm.commitTransfer = commitTransfer;	

		function openCancelTransModal() {

			var modalInstance = $uibModal.open({
				templateUrl: 'app/templates/modals/modal.cancel-transaction.tpl.htm',
				appendTo: undefined,
				controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

				  	$scope.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};

				  	$scope.cancelTrans = function () {
				  		ngCart.empty();
				    	$uibModalInstance.close();
				    	$state.go('portfolio');
				  	};

				  	$scope.cancel = function() {
				  		$uibModalInstance.dismiss('cancel');
				  	};

				}]
			});

		};

		function commitTransfer() {
			
			vm.commitTransferBtn = true; //prevent double click

			bankTransferCommitService.commitTransfer(vm.orderObj) //SERVICE HANDLES STATE.GO
			.then(
	            function(response){
	            	console.log(response)
	            	$state.go('bank-transfer-success', {orderObj: response});
	            },
	            function(errResponse){
	            	if(errResponse) {
						var modalInstance = $uibModal.open({
							templateUrl: 'app/templates/modals/modal.commit-error.tpl.htm',
							appendTo: undefined,
							controller: ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {

							  	$scope.dismissModal = function () {
							    	$uibModalInstance.close();
							  	};

							  	$scope.cancel = function() {
							  		$uibModalInstance.dismiss('cancel');
							  	};
							}]
						});
					}
	            }
	        );	            
		};
	}
}