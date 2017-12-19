app.component('currentTransactions', {
	bindings: { 
		transactions: '<',
		ngModel: '='
	},
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope, NgTableParams, $scope, $filter, $timeout, $state) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	  	$scope.patentAppData = {
		  	defaultSelect: null
	  	}

	  	$scope.clientRefData = {
		  	defaultSelect: null
	  	}

		vm.animate = false;

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);    		

	  	$scope.transactionListFilter = function(data, filter, i) {
	     	
		    if(filter == 'clientRefFilter') { //reset altenrate select option
		        $scope.filter = data;
	    		$scope.patentAppData.defaultSelect = null;
		    } else {
		        $scope.filter = data;
		        $scope.clientRefData.defaultSelect = null;
		    }

		}

		vm.displayTrans = function() {
			$state.go('current-transactions');
		}

		vm.$onInit = function() {

			var transactions = vm.transactions;
			console.log(transactions)
			transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})

			vm.tableData = transactions;

		   	vm.sortType     = 'transId'; // set the default sort type
		  	vm.sortReverse  = false;  // set the default sort order			

  		   	vm.sortType = function(column) {
		   		if(column == 'transStartDate') {
		   			vm.sortTransDate = true;
		   			vm.selectedSortType = (function() {

		   				if (vm.sortReverse == false) {
		   					vm.tableData.sort(function(a, b){
		   						console.log(a)
		   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
		   						return dateB - dateA;
		   					})
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
		   						return dateB - dateA
		   					})
		   				}
	   				
	   				}())

		   		} else if (column == 'transAmount_USD') {
		   			vm.sortTransCost = true;
		   			vm.selectedSortType = (function() {
		   				if (vm.sortReverse == false) {
		   					vm.tableData.sort(function(a, b){
		   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
		   						return costB - costA;
		   					})
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
		   						return costB - costA;
		   					})
		   				}
   				
   					}())

		   		} else if (column == 'transLength') {
		   			vm.sortTransItems = true;
		   			vm.selectedSortType = (function() {
						if (vm.sortReverse == false) {
		   					vm.tableData.sort(function(a, b){
		   						var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
		   						return renewalsB - renewalsA;
		   					})
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
		   						return renewalsB - renewalsA;
		   					})
		   				}
	   				}())
	   				
		   		} else {
		   			vm.sortTransCost = false;
		   			vm.sortTransDate = false;
		   			vm.sortTransItems = false
		   			vm.selectedSortType = column;
		   		}
		   	}	



		}

      	vm.rowSelect = function(event){
      		vm.transInfoContent = true;
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