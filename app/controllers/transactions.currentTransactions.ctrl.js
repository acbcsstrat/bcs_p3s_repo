angular.module('ppApp').controller('currentTransactionsCtrl', currentTransactionsCtrl);

currentTransactionsCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$state', 'currentTransactions', 'currentTransactionsService'];

function currentTransactionsCtrl($rootScope, $scope, $timeout, $state, currentTransactions, currentTransactionsService) {

	var vm = this;

	vm.patentAppData = { defaultSelect: null };
  	vm.clientRefData = { defaultSelect: null };
   	vm.sortType  = sortType; // set the default sort type
  	vm.sortReverse  = false;  // set the default sort order
   	vm.transactionListFilter = transactionListFilter;
   	vm.noClientRef = noClientRef;
   	vm.displayTrans = displayTrans;
   	vm.rowSelect = rowSelect;
   	vm.selectedSortType = 'p3S_TransRef';

    function init() {

		currentTransactions.forEach(function(data){
			data.serviceUIs.map(function(o, i){ 
				o.appAndType = o.patentUI.ep_ApplicationNumber + ' (' + o.newType +')';
				if(o.patentUI.clientRef == '') {
					o.patentUI.clientRef = '[No Client Reference Provided]'
				}
			})
			// }
		})    

		currentTransactions.map(function(o, i){
			o.actionProgress = currentTransactionsService.actionProgress(o.latestTransStatus);
		})

   	}

   	init();

   	function sortType(column) {

		vm.sortTransCost = false;
		vm.sortPatentApplicationNumber = false;
		vm.sortClientRef = false;
		vm.sortTransDate = false;
		vm.sortTransItems = false;
		vm.selectedSortType = column;  

   		switch(column) {
   			case 'transStartDate':

   			vm.sortTransDate = true;
   			vm.selectedSortType = (function() {

   				if (vm.sortReverse === false) { //if descending high to low
   					vm.tableData.sort(function(a, b){
   						var dateA = a.transStartDate, dateB = b.transStartDate;
   						return dateA - dateB;
   					});

   				} else {  //if ascending low to high
   					vm.tableData.sort(function(a, b){
   						var dateA = a.transStartDate, dateB = b.transStartDate;
   						return dateA - dateB;
   					});
   				}

			}());
   			
   			break;
   			case 'clientRef':

	   			vm.sortClientRef = true;

	   			vm.selectedSortType = (function() {
   					vm.tableData.sort();
				}());

   			
   			break;
   			case 'patentApplicationNumber':

	   			vm.sortPatentApplicationNumber = true;
	   			vm.selectedSortType = (function() {

	   				if(vm.sortReverse === false) {
	   					vm.tableData.sort(function(a, b){
	   						var patentAppA = parseInt(a.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', '')), patentAppB = parseInt(b.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', ''));
	   						return patentAppA - patentAppB;
	   					});
	   				} else {
	   					vm.tableData.sort(function(a, b){
	   						var patentAppA = parseInt(a.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', '')), patentAppB = parseInt(b.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', ''));
	   						return patentAppA - patentAppB;
	   					});
	   				}
				}());

   			break;
   			case 'transAmount_USD':

	   			vm.sortTransCost = true;
	   			vm.selectedSortType = (function() {
	   				if (vm.sortReverse === false) {
	   					vm.tableData.sort(function(a, b){
	   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
	   						return costA - costB;
	   					});
	   				} else {
	   					vm.tableData.sort(function(a, b){
	   						var costA = a.transAmount_USD, costB = b.transAmount_USD;
	   						return costA - costB;
	   					});
	   				}
					}());
   			
   			break;
   			case 'transLength':

	   			vm.sortTransItems = true;
	   			vm.selectedSortType = (function() {
					if (vm.sortReverse === false) { //Descending
	   					vm.tableData.sort(function(a, b){

	   						var actionA = a.serviceUIs.length, actionB = b.serviceUIs.length;
	 
	   						return actionA - actionB;
	   					});        
	   				} else {
	   					if(vm.sortReverse === true) { //Ascending
		   					vm.tableData.sort(function(a, b){
		   						var actionA = a.serviceUIs.length, actionB = b.serviceUIs.length;
		   						return actionA - actionB;
		   					});
	   					}
	   				}
   				}());
   			break;		   				
   			
   		}

   	};

	function transactionListFilter(item, index) {

		var timestamp = new Date().getTime();

	    vm.tableData.forEach(function(_ , idx) {
	         if (index != idx) {
	             _.selectedUi = null;
	         };
	    });

        $scope.filter = { 
    		selected: item,
    		stamp: timestamp
    	};

	}; 

	function noClientRef() {
		return true;
	}

	function displayTrans() {
		$state.go('current-transactions');
	};		

  	function rowSelect(item, index, event){
  		transactionListFilter(item, index)
  		vm.transInfoContent = true;
  		if(!$(event.target).hasClass('cartbtn')) {
      		var id = ($($(event.currentTarget).find('a')));
      		var patentId = id[0].hash;
      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
  		}
  	};

  	$scope.$on('$destroy', function(){
  		$timeout.cancel(loadTimeout)
  	})
	
}