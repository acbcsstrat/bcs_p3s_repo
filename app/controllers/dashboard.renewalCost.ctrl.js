angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patents', 'currentTransactionsService', 'patentsService', 'dashboardService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patents, currentTransactionsService, patentsService, dashboardService) {

	var vm = this;

	vm.renewalfxTimeframe = 'Today';
	vm.fetchItemRenewal = fetchItemRenewal;
	vm.fetchItemTransaction = fetchItemTransaction;
	$scope.$on('updateCost', function(e, o){
      	var patent = dashboardService.getPatent();
      	if(patent.renewalFeeUI !== null) {
      		vm.serviceCost = patent.renewalFeeUI;
      	} else {
      		vm.serviceCost = patent.form1200FeeUI;
      	}
	})



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
