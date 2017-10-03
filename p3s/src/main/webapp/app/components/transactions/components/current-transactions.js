app.component('currentTransactions', {
	bindings: { 
		transactions: '<' },
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope, NgTableParams) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	   	vm.sortType     = 'transId'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order		

		vm.$onInit = function() {

			var transactions = vm.transactions;
			console.log(transactions)
			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})

			vm.tableParams = new NgTableParams({
				sorting: { p3S_TransRef: "desc" },
		        page: 1,            // show first page
		        count: 10000           // count per page
			    }, {
			        counts: [],
			        dataset: transactions
			    }
	    	);
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

app.directive('fixedTableHeaders', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $timeout(function () {
        
          container = element.parentsUntil(attrs.fixedTableHeaders);
	        element.stickyTableHeaders({ scrollableArea: container, "fixedOffset": 0 });

      }, 0);
    }
  }
}]);