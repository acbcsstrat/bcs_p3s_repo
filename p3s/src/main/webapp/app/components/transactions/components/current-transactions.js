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
			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})
		}

      	vm.rowSelect = function(event){
      		if(!$(event.target).hasClass('cartbtn')) {
	      		var id = ($($(event.currentTarget).find('a')));
	      		var patentId = id[0].hash;
	      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
      		}
      	}

	}
});
