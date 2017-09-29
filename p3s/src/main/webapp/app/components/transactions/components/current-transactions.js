app.component('currentTransactions', {
	bindings: { 
		transactions: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	   	vm.sortType     = 'transId'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order		

		vm.$onInit = function() {

			console.log(vm.transactions)

			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})
		}

	}
});
