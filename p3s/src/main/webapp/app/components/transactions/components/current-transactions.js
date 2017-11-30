app.component('currentTransactions', {
	bindings: { 
		transactions: '<',
		ngModel: '='
	},
	templateUrl: 'p3sweb/app/components/transactions/views/current-transactions.htm',
	controller: function(currentTransactionsService, $rootScope, NgTableParams, $scope, $filter) {

		var vm = this;

		$rootScope.page = 'Current Transactions'

	   	vm.sortType     = 'transId'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order	

	  	$scope.patentAppData = {
		  	defaultSelect: null
	  	}

	  	$scope.clientRefData = {
		  	defaultSelect: null
	  	}

	  	$scope.transactionListFilter = function(data, filter, i) {
	     	
		    if(filter == 'clientRefFilter') {
		        $scope.filter = data;
	    		$scope.patentAppData.defaultSelect = null;
	    		
	    		// if(this.$parent.row.id !== i) {
	    		// 	console.log('hello')
	    		// 	$scope.clientRefData.defaultSelect = null;
	    		// }
		    } else {
		        $scope.filter = data;
		        $scope.clientRefData.defaultSelect = null;
	    		// if(this.$parent.row.id !== i) {
	    		// 	        			console.log('hello')
	    		// 	$scope.patentAppData.defaultSelect = null;
	    		// }			        
		    }		  			
		}
		  		
		vm.$onInit = function() {

			var transactions = vm.transactions;

			vm.transactions.forEach(function(data){
				data.renewalProgress = currentTransactionsService.renewalProgress(data.latestTransStatus);
			})

			$scope.contents = transactions;

			$scope.contents.sort(function(a, b){
				var dateA = new Date(a.renewalDueDate), dateB = new Date(b.renewalDueDate);
				return dateB - dateA;
			})

			var tableData = $scope.contents;
			console.log(tableData)
			var secondData = $scope.contents;

			vm.tableParams = new NgTableParams({
					sorting: { transStartDate: "desc" },
			        page: 1,            // show first page
			        count: 10000           // count per page
			    }, {
			        counts: [],
			        total: tableData.length,
			        getData: function(params) {

			        	var orderedData;

			        	if (params.sorting().transStartDate === 'asc') {
			        		tableData.sort(function(a, b){
			        			console.log('ASC')
			        			var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
			        			return dateA - dateB;
			        		})

			        		orderedData = tableData;
			        		console.log(orderedData)
			        	} else if (params.sorting().transStartDate === 'desc') {
			        		tableData.sort(function(a, b) {
			        			var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
			        			console.log('desc')
			        			return dateB - dateA;
			        		})
			        		orderedData = tableData;
			        	} else if(!params.sorting().transStartDate) {
		        			orderedData = params.sorting() ? $filter('orderBy')(tableData, params.orderBy()) : tableData;		        		
			        	}

						if(params.sorting().clientRef === 'asc') {

							tableData.sort(compare)

							var clientUIs = [];
							for (var i = 0; i < tableData.length; i++){
								console.log(tableData[i]["renewalUIs"].length)
							  for (var j = 0 ; j < tableData[i]["renewalUIs"].length; j++){
							     // add each UI to your list individually.
							     clientUIs.push(tableData[i]["renewalUIs"][j]["patentUI"]);
							  }
							}

							// clientUIs.sort(compare)

							function compare(a,b) {
							  if (a.clientRef < b.clientRef)
							    return -1;
							  if (a.clientRef > b.clientRef)
							    return 1;
							  return 0;
							}

							orderedData = tableData.sort(function(a, b){
								return clientUIs.indexOf(a) - clientUIs.indexOf(b);
							})

							console.log(orderedData)


						} else if(params.sorting().clientRef === 'desc') {

							tableData.sort(compare)

							var clientUIs = [];
							for (var i = 0; i < tableData.length; i++){
							  for (var j = 0 ; j < tableData[i]["renewalUIs"].length; j++){
							     // add each UI to your list individually.
							     clientUIs.push(tableData[i]["renewalUIs"][j]["patentUI"]["clientRef"]);
							  }
							}

							// clientUIs.sort(compare)

							// function compare(a,b) {
							//   if (a.clientRef < b.clientRef)
							//     return -1;
							//   if (a.clientRef > b.clientRef)
							//     return 1;
							//   return 0;
							// }

							

							orderedData = tableData.sort(function(a, b){
								return clientUIs.indexOf(b) - clientUIs.indexOf(a);
							})

							console.log(orderedData)

						} else if(!params.sorting().clientRef) {
							console.log('not')
		        			orderedData = params.sorting() ? $filter('orderBy')(tableData, params.orderBy()) : tableData;		        		
			        	} 

			        	return orderedData;

			        }
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