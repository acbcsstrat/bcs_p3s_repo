angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patents', 'fxCalculationService', 'currentTransactionsService', 'patentsService', 'selectPhaseService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patents, fxCalculationService, currentTransactionsService, patentsService, selectPhaseService) {

	var vm = this;

	vm.renewalfxTimeframe = 'Today';
	vm.patentFx = fxCalculationService;
	vm.fxPeriodActive = fxPeriodActive;
	vm.fetchItemRenewal = fetchItemRenewal;
	vm.fetchItemTransaction = fetchItemTransaction;
	vm.selectedPhase = selectPhaseService;

	$scope.$on('updatePhase', function(e, o){
		if(vm.selectedPhase.getPhase().patents.length === 0) {
			vm.patentFx = null;
		} else {
			vm.patentFx = fxCalculationService;
		}
	})

	function fxPeriodActive(fxActive) {

		switch(fxActive) {
			case 0:
				vm.renewalfxTimeframe = 'Today';
			break;
			case 1:
				vm.renewalfxTimeframe = 'Yesterday';
			break;
			case 2:
				vm.renewalfxTimeframe = 'Last Week';
			break;
			case 3:
				vm.renewalfxTimeframe = 'Last Mth';											
		}

	};

	function fetchItemRenewal() { //direct user to renewal tab in patents
		patentsService.activePatentItemMenu();
	};

	function fetchItemTransaction(id) { //direct user to transaction item
		currentTransactionsService.fetchCurrentTransactions()
		.then(
			function(response) {
				response.forEach(function(data) {
					const transId = data.id;

					data.renewalUIs.forEach(function(data, i) {

						if(data.patentUI.id == id) {

							$state.go('current-transactions.current-transaction-item',{transId: transId})
							.then(
								function(response){
									$timeout(function() {
										$location.hash('currTransAnchor');
									  	$anchorScroll();
									}, 300);
								},
								function(errResponse){
									console.log(errResponse);
								}
							);								
						}
					});
				});
			},
			function(errResponse) {
				// console.log(errResponse);
			}
		);
	};

}
