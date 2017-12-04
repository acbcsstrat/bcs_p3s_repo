app.component('currentTransactions', {
	bindings: { 
		transactions: '<',
		ngModel: '='
	},
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope, NgTableParams, $scope, $filter, $timeout) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	  	$scope.patentAppData = {
		  	defaultSelect: null
	  	}

	  	$scope.clientRefData = {
		  	defaultSelect: null
	  	}

		vm.animate = false;

		vm.transInfoContent = false;

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);    		

	  	$scope.transactionListFilter = function(data, filter, i) {
	     	
		    if(filter == 'clientRefFilter') {
		        $scope.filter = data;
	    		$scope.patentAppData.defaultSelect = null;
		    } else {
		        $scope.filter = data;
		        $scope.clientRefData.defaultSelect = null;
		    }

		}

		vm.$onInit = function() {

			var transactions = vm.transactions;

			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
				data.renewalUIs.forEach(function(childData){
					vm.clientRefFilter = childData.patentUI;
				})
			})

			vm.tableData = transactions;

		   	vm.sortType     = 'transId'; // set the default sort type
		  	vm.sortReverse  = false;  // set the default sort order			

  		   	vm.sortType = function(column) {
		   		if(column == 'transInitiated') {
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

		   		} else if (column == 'cost') {
		   			vm.selectedSortType = (function() {

		   				if (vm.sortReverse == false) {
		   					vm.tableData.sort(function(a, b){
		   						console.log(a)
		   						var dateA = new Date(a.transAmount_USD), dateB = new Date(b.transAmount_USD);
		   						return dateB - dateA;
		   					})
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var dateA = new Date(a.transAmount_USD), dateB = new Date(b.transAmount_USD);
		   						return dateB - dateA
		   					})
		   				}
	   				
	   				}())

		   		} else if(column == 'clientRef') {
		   			console.log('hello')
		   			vm.selectedSortType = (function() {

		   				if (vm.sortReverse == false) {
		   					vm.tableData.sort(function(a, b){
		   						
		   						var dateA = new Date(a.clientRef), dateB = new Date(b.clientRef);
		   						return dateB - dateA;
		   					})
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var dateA = new Date(a.clientRef), dateB = new Date(b.clientRef);
		   						return dateB - dateA
		   					})
		   				}
	   				
	   				}())
		   		} else {
		   			vm.sortDate = false;
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