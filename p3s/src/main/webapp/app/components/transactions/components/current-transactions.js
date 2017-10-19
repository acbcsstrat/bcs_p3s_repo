app.component('currentTransactions', {
	bindings: { 
		transactions: '<',
		ngModel: '='
	},
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope, NgTableParams, $scope) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	   	vm.sortType     = 'transId'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order	

	  	$scope.transactionFilter = function(data, filter) {
		  			
			  		// if(filter == 'clientRefFilter') {
			  		// 	$scope.selectedAppOption = data;
			  		// 	$scope.filter = data;
			  		// 	 if(angular.isDefined($scope.selectedAppOption)){
			  		// 	 	console.log(data)
				   //          delete $scope.selectedAppOption;
				   //      }
			  		// 	console.log('want to reset application')
			  		// } else {
			  		// 	$scope.filter = data;
			  		// 	$scope.selectedRefOption = data;
			  		// 	 if(angular.isDefined($scope.selectedRefOption)){
			  		// 	 	console.log(data)
				   //          delete $scope.selectedRefOption;
				   //      }
			  		// 	console.log('want to reset client')
			  		// }
				    if(filter == 'clientRefFilter') {
				        // $scope.selectedAppOption = '';
				        $scope.filter = data;
				        console.log('want to reset applcation')
				    } else {
				        // $scope.selectedRefOption = '';
				        $scope.filter = data;
				        console.log('want to reset clent')
				    }			  		

		  	}

		vm.$onInit = function() {



			var transactions = vm.transactions;

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