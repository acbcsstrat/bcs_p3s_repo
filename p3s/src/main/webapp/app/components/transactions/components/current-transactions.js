app.component('currentTransactions', {
	bindings: { 
		transactions: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService) {

		var vm = this;



		vm.$onInit = function() {



			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})
		}

		

		// vm.renewalProgress = currentTransactionsService.renewalProgress(currTransStatus);	

	}
});
