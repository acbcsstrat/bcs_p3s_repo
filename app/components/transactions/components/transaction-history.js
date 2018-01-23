app.component('transactionHistory', {
	bindings: { transactionHistory: '<'},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history.htm',
	controller: ['$rootScope', 'NgTableParams', '$timeout', function ($rootScope, NgTableParams, $timeout) {

		var vm = this;

		$rootScope.page = 'Transaction History';

		vm.transInfoContent = false;

		vm.animate = false;

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);    		

		vm.$onInit = () => {

			var transactions = vm.transactionHistory;

			vm.tableData = transactions;

		   	vm.sortType     = 'transId'; // set the default sort type
		  	vm.sortReverse  = false;  // set the default sort order			

	   		vm.sortType = function(column) {
		   		if(column == 'transStartDate') {
		   			vm.sortTransDate = true;
		   			vm.selectedSortType = (function() {

		   				if (vm.sortReverse === false) {
		   					vm.tableData.sort(function(a, b){
		   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
		   						return dateB - dateA;
		   					});
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
		   						return dateB - dateA;
		   					});
		   				}
	   				
	   				}());

		   		} else if (column == 'transAmount_USD') {
		   			vm.sortTransCost = true;
		   			vm.selectedSortType = (function() {
		   				if (vm.sortReverse === false) {
		   					vm.tableData.sort(function(a, b){
		   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
		   						return costB - costA;
		   					});
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
		   						return costB - costA;
		   					});
		   				}
   				
   					}());
		   		} else if (column == 'transLength') {
		   			vm.sortTransItems = true;
		   			vm.selectedSortType = (function() {
						if (vm.sortReverse === false) {
		   					vm.tableData.sort(function(a, b){
		   						var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
		   						return renewalsB - renewalsA;
		   					});
		   				} else {
		   					vm.tableData.sort(function(a, b){
		   						var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
		   						return renewalsB - renewalsA;
		   					});
		   				}
	   				}());
		   		} else {
		   			vm.sortTransCost = false;
		   			vm.sortTransDate = false;
		   			vm.sortTransItems = false;
		   			vm.selectedSortType = column;
		   		}
		   	};
	   
	      	vm.rowSelect = function(event){
	      		vm.transInfoContent = true;
	      		if(!$(event.target).hasClass('cartbtn')) {
		      		var id = ($($(event.currentTarget).find('a')));
		      		var patentId = id[0].hash;
		      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
	      		}
	      	};
		};	
	}
]});

app.directive('fixedTableHeaders', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var container;
      $timeout(function () {
      	container = element.parentsUntil(attrs.fixedTableHeaders);
        element.stickyTableHeaders({ scrollableArea: container, "fixedOffset": 0 });
      }, 0);
    }
  };
}]);