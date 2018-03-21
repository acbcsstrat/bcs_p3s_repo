function currentTransactionsCtrl($rootScope, $scope, $timeout, $state, currentTransactions, currentTransactionsService) {

	var vm = this;

	$rootScope.page = 'Current Transactions';

    $timeout(function() {
      	vm.animate = true;
    }, 300);

	currentTransactions.forEach(function(data){
		if(data.renewalUIs.length > 1) {
			data.renewalUIs.map(function(o, i){ 
				if(o.patentUI.clientRef == '') {
					o.patentUI.clientRef = '[No Client Description Provided]'
				}
			})					
		}
	})    

	currentTransactions.map(function(o, i){
		o.renewalProgress = currentTransactionsService.renewalProgress(o.latestTransStatus);
	})

	vm.tableData = currentTransactions;	

   	vm.sortType     = 'transId'; // set the default sort type
  	vm.sortReverse  = false;  // set the default sort order

   	vm.sortType = function(column) {

   		switch(column) {
   			case 'transStartDate':

   			vm.sortTransDate = true;
   			vm.selectedSortType = (function() {

   				if (vm.sortReverse === false) {

   					vm.tableData.sort(function(a, b){
   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
   						console.log(dateA - dateB)
   						return dateB - dateA;
   					});

   				} else {
   					vm.tableData.sort(function(a, b){
   						var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
   						console.log(dateA - dateB)
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
   			
   		}

   	};	

	vm.patentAppData = {
	  	defaultSelect: null
  	};

  	vm.clientRefData = {
	  	defaultSelect: null
  	};

  	vm.transactionListFilter = function(data, filter, i) {

	    if(filter == 'clientRefFilter') { //reset altenrate select option
	        $scope.filter = data;
    		vm.patentAppData.defaultSelect = null;
	    } else {
	        $scope.filter = data;
	        vm.clientRefData.defaultSelect = null;
	    }

	};

	vm.noClientRef = function() {
		return true;
	}

	vm.displayTrans = function() {
		$state.go('current-transactions');
	};		

  	vm.rowSelect = function(event){
  		vm.transInfoContent = true;
  		if(!$(event.target).hasClass('cartbtn')) {
      		var id = ($($(event.currentTarget).find('a')));
      		var patentId = id[0].hash;
      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
  		}
  	};
	
}

app.controller('currentTransactionsCtrl', currentTransactionsCtrl);