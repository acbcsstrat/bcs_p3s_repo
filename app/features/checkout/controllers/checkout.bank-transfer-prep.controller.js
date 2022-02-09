BankTransferPrepController.$inject = ['BankTransferCommitService', '$state', '$scope', '$stateParams', '$uibModal', 'ngCart']

export default function BankTransferPrepController(BankTransferCommitService, $state, $scope, $stateParams, $uibModal, ngCart) {

	var vm = this;

	vm.pageTitle = 'Confirm Order';
	vm.orderObj = $stateParams.orderObj;
	vm.details = $stateParams.details
	vm.preparingTransaction = false;
	if(vm.orderObj == '') { //if page is refreshed when on bank prepration page
		$state.go('portfolio', {reload: true}); //direct user to patents
	} else {

		vm.details.patentNos = $stateParams.orderObj.basketItems;
		vm.orderObj.billingDetails = $stateParams.details.billingDetails;

		vm.openCancelTransModal = openCancelTransModal;
		vm.commitTransfer = commitTransfer;	



		function openCancelTransModal() {

			var modalInstance = $uibModal.open({
				template: require('html-loader!../html/modals/modal.cancel-transaction.tpl.htm').default,
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

			vm.preparingTransaction = true;

			vm.orderObj.billingDetails = $stateParams.details.billingDetails;
			BankTransferCommitService.commitTransfer(vm.orderObj) //SERVICE HANDLES STATE.GO
			.then(
          function(response){
          	$state.go('bank-transfer-success', {orderObj: response});
          },
          function(errResponse){
          	if(errResponse.status !== 409){
  						var modalInstance = $uibModal.open({
  							template: require('html-loader!../html/modals/modal.commit-error.tpl.htm').default,
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
      						template: require('html-loader!../html/modals/modal.commit-error-price.tpl.htm').default,
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