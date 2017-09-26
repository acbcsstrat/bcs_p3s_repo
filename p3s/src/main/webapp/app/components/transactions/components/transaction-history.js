app.component('transactionHistory', {
	bindings: { transactionHistory: '<'},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history.htm',
	controller: function ($rootScope) {
		$rootScope.page = 'Transaction History';
	}
});