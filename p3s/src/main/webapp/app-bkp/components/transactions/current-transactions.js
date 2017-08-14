app.component('currentTransactions', {
	bindings: { transactions: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: ['currentTransactionsService', function(currentTransactionsService) {

		// var vm = this;

		// vm.fetchCurrentTransactions = function() {
		// 	transactionsService.fetchCurrentTransactions();
		// }

	}]

});