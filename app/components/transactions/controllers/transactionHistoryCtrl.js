angular.module('ppApp').controller('transactionHistoryCtrl', transactionHistoryCtrl);

transactionHistoryCtrl.$inject = ['$rootScope', '$timeout', 'transactionHistory']

function transactionHistoryCtrl($rootScope, $timeout, transactionHistory) {

	var vm = this;

	$rootScope.page = 'Transaction History';

    $timeout(function() {
  		vm.animate = true;
    }, 300);

	transactionHistory.forEach(function(data){
		if(data.renewalUIs.length > 1) {
			data.renewalUIs.map(function(o, i){ 
				if(o.patentUI.clientRef == '') {
					o.patentUI.clientRef = '[No Client Description Provided]'
				}
			})
		}
	})

	vm.tableData = transactionHistory;
	vm.sortType = sortType;
   	vm.selectedSortType = 'transId'; // set the default sort type
  	vm.sortReverse  = false;  // set the default sort order
	vm.transactionListFilter = transactionListFilter;
	vm.noClientRef = noClientRef;
	vm.displayTrans = displayTrans;
	vm.rowSelect = rowSelect;  	
	vm.patentAppData = { defaultSelect: null }; //reset altenrate select option logic
  	vm.clientRefData = { defaultSelect: null };	 //reset altenrate select option logic

	function sortType(column) {

		switch(column) {
			case 'transStartDate':

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
			
			break;
			case 'clientRef':

				vm.sortClientRef = true;
				vm.selectedSortType = (function() {

					var result = []

					var arrayOrder = [];

					vm.tableData.forEach(function(data) {
						
						data.renewalUIs.map(function(o, i){ 
							arrayOrder.push(o.patentUI.clientRef);
						})
					})

					arrayOrder.sort();

					arrayOrder.forEach(function(key){
						// console.log(key)
						var found = false;

						vm.tableData = vm.tableData.filter(function(item){
							if(item.renewalUIs.length === 1) {
								if(!found && item.renewalUIs[0].patentUI.clientRef == key) {
									result.push(item)
						            found = true;
						            return false;									
								} else {
									return true;
								}
							} else {
								result.push(item)
							}
						})

					})

					vm.tableData = result;

				})
			
			break;
			case 'patentApplicationNumber':

				vm.sortPatentApplicationNumber = true;
				vm.selectedSortType = (function() {

					var result = []

					var arrayOrder = [];

					vm.tableData.forEach(function(data) {
						
						data.renewalUIs.map(function(o, i){ 
							arrayOrder.push(o.patentUI.patentApplicationNumber);
						})
					})

					arrayOrder.sort();

					arrayOrder.forEach(function(key){

						var found = false;

						vm.tableData = vm.tableData.filter(function(item){
							
							if(item.renewalUIs.length === 1) {
								if(!found && item.renewalUIs[0].patentUI.patentApplicationNumber == key) {
									result.push(item)
						            found = true;
						            return false;									
								} else {
									return true;
								}
							} else {
								result.push(item)
							}

						})

					})

					vm.tableData = result;

				})
			
			break;
			case 'transAmount_USD':

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
			
			break;
			case 'transLength':

				vm.sortTransItems = true;
				vm.selectedSortType = (function() {

					if (vm.sortReverse === false) {
						vm.tableData.sort(function(a, b){
							var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
							return renewalsB - renewalsA;
						});
					} else {
						if(vm.sortReverse === true) {
	   					vm.tableData.sort(function(a, b){
	   						var renewalsA = a.renewalUIs.length, renewalsB = b.renewalUIs.length;
	   						console.log(renewalsA - renewalsB)
	   						return renewalsB - renewalsA;
	   					});
						}
					}

				}());
			
			default:

				vm.sortTransCost = false;
				vm.sortPatentApplicationNumber = false;
				vm.sortClientRef = false;
				vm.sortTransDate = false;
				vm.sortTransItems = false;
				vm.selectedSortType = column;  		   				
			
		} //switch end

	}; //sorttype end

  	function transactionListFilter(data, filter, i) {

	    if(filter == 'clientRefFilter') { //reset altenrate select option
	        $scope.filter = data;
    		vm.patentAppData.defaultSelect = null;
	    } else {
	        $scope.filter = data;
	        vm.clientRefData.defaultSelect = null;
	    }

	};

	function noClientRef() {
		return true;
	}

	function displayTrans() {
		$state.go('current-transactions');
	};		


  	function rowSelect(event){
  		if(!$(event.target).hasClass('cartbtn')) {
      		var id = ($($(event.currentTarget).find('a')));
      		var patentId = id[0].hash;
      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
  		}
  	};
}	