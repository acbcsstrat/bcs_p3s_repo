angular.module('ppApp').controller('bankTransferPrepCtrl', bankTransferPrepCtrl);

bankTransferPrepCtrl.$inject = ['bankTransferCommitService', '$state', '$scope', '$stateParams', '$rootScope', '$uibModal', 'ngCart']

function bankTransferPrepCtrl(bankTransferCommitService, $state, $scope, $stateParams, $rootScope, $uibModal, ngCart) {

	var vm = this;

	vm.pageTitle = 'Confirm Order';

	vm.orderObj = $stateParams.orderObj;

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
				controllerAs: '$ctrl',
				controller: ['$uibModalInstance', function($uibModalInstance) {

				  	this.dismissModal = function () {
				    	$uibModalInstance.close();
				  	};

				  	this.cancelTrans = function () {
				  		ngCart.empty();
				    	$uibModalInstance.close();
				    	$state.go('portfolio');
				  	};

				}]
			});

		};

		function commitTransfer() {
			
			vm.commitTransferBtn = true; //prevent double click

			bankTransferCommitService.commitTransfer(vm.orderObj) //SERVICE HANDLES STATE.GO
			.then(
	            function(response){
	            	$state.go('bank-transfer-success', {orderObj: response});
	            },
	            function(errResponse){
	            	if(errResponse.status === 500) {
						var modalInstance = $uibModal.open({
							templateUrl: 'app/templates/modals/modal.commit-error.tpl.htm',
							appendTo: undefined,
           					controllerAs: '$ctrl',							
							controller: ['$uibModalInstance', function($uibModalInstance) {

							  	this.dismissModal = function () {
							    	$uibModalInstance.close();
							    	$state.go('portfolio', {reload: true})
							  	};

							}]
						});
					}
	            	if(errResponse.status === 409) {
						var modalInstance = $uibModal.open({
							templateUrl: 'app/templates/modals/modal.commit-error-price.tpl.htm',
							appendTo: undefined,
           					controllerAs: '$ctrl',								
							controller: ['$uibModalInstance', function($uibModalInstance) {

							  	this.dismissModal = function () {
							    	$uibModalInstance.close();
							    	$state.go('portfolio', {reload: true})							    	
							  	};

							}]
						});
					}					
	            }
	        );	            
		};
	}
}