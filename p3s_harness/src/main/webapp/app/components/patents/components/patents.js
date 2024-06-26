app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: ['$scope', 'Idle', 'Keepalive', '$uibModal', '$timeout', '$http', '$rootScope', 'patentsRestService', '$state', 'currentTransactionsService', 'patentsService', '$anchorScroll', '$location', function($scope, Idle, Keepalive, $uibModal, $timeout, $http, $rootScope, patentsRestService, $state, currentTransactionsService, patentsService, $anchorScroll, $location) {

		var vm = this;

		$rootScope.page = 'List Patents';

		vm.animate = false;

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);    		

	    vm.date = new Date().getTime();

		vm.displayPatents = function() {
			$state.go('patents');
		};

		vm.fetchItemRenewal = function() {
			patentsService.activePatentItemMenu();
		};

		vm.fetchItemTransaction = function(id) {
			currentTransactionsService.fetchCurrentTransactions()
			.then(
				function(response) {
					response.forEach(function(data) {

						const transId = data.id;
						
						data.renewalUIs.forEach(function(data, i) {
							if(data.patentUI.id == id) {
								$state.go('current-transactions.current-transaction-item',{transId: transId})
								.then(
									function(response){
										$timeout(function() {
											$location.hash('currTransAnchor');
										  	$anchorScroll();
										}, 300);
									},
									function(errResponse){
										console.log(errResponse);
									}
								);
							}
						});
					});
				},
				function(errResponse) {
					console.log(errResponse);
				}
			);
		};

		vm.$onInit = function() {

			vm.tableData = vm.patents;
			var patents = vm.patents;
			var allPatents = [];
			var greenPatents = [];
			var amberPatents = [];
			var redPatents = [];
			var bluePatents = [];
			var blackPatents = [];
			var greyPatents = [];

	  		vm.displayPhase = function(id) {
				switch (id) {
				    case 1:
				     	vm.tableData = allPatents;
			        break;
				    case 2:
				     	vm.tableData = greenPatents;
			        break;
				    case 3:
				     	vm.tableData = amberPatents;
			        break;
				    case 4:
				     	vm.tableData = redPatents;
			        break;
				    case 5:
				     	vm.tableData = bluePatents;
				     	break;
			     	case 6:
				    	vm.tableData = blackPatents;
				    break;
			     	case 7:
				    	vm.tableData = greyPatents;
				}
			};

			$timeout(function() {
				vm.displayPhase(1);
			}, 100);
			

			patents.forEach(function(item){

				if(item.costBandColour) {
	     			allPatents.push(item);
			     	if(allPatents.length === 0) {
						vm.allPatentsLength = 0;
					} else {
						vm.allPatentsLength = allPatents.length;
					}
	     		} else {
	     			vm.patents = null;
	     		}

	     		if(item.renewalStatus !== 'Renewal in place' && item.renewalStatus !== 'Way too late to renew' &&  item.renewalStatus !== 'No renewal needed') {
					switch(item.costBandColour) {
						case 'Green':
							greenPatents.push(item);
						break;
						case 'Amber':
							amberPatents.push(item);
						break;
						case 'Red':
							redPatents.push(item);
						break;
						case 'Blue':
							bluePatents.push(item);
						break;
						case 'Black':
							blackPatents.push(item);
           				break;
						default: vm.patents = null;																								
					}
     			} else {
					greyPatents.push(item);
     			}

		     	if(greenPatents.length === 0) { 
	 				vm.greenPatentsLength = 0;
	 			} else {
	 				vm.greenPatentsLength = greenPatents.length;
	 			}
		     	if (amberPatents.length === 0) {
	 				vm.amberPatentsLength = 0;
	 			} else {
	 				vm.amberPatentsLength = amberPatents.length;
	 			}
	 			if(redPatents.length === 0) {
	 				vm.redPatentsLength = 0;
	 			} else {
	 				vm.redPatentsLength = redPatents.length;
	 			}
	 			if(bluePatents.length === 0) {
	 				vm.bluePatentsLength = 0;
	 			} else {
	 				vm.bluePatentsLength = bluePatents.length;
	 			}
	 			if(blackPatents.length === 0) {
	 				vm.blackPatentsLength = 0;
	 			} else {
	 				vm.blackPatentsLength = blackPatents.length;
	 			}

	 			if(greyPatents.length === 0) {
	 				vm.greyPatentsLength = 0;
	 			} else {
	 				vm.greyPatentsLength = greyPatents.length;
	 			}	 			

	 			function calcProgress(start, end) {

					var today = new Date().getTime();

					var total = end - start;
					var progress = today - start;

					return Math.floor(((progress) / (total)) * 100);

	 			}
               
               
	 			
				patentsRestService.fetchCostAnalysis(item.id)
                .then(
                    function(response){
               			var start;
               			var end;
                        switch(item.costBandColour) {
                            case 'Green':
							start = new Date(response.greenStartDate);
							end = new Date(response.amberStartDate);
							item.progressBar = calcProgress(start, end);						                                  
                                break;
                            case 'Amber':
							start = new Date(response.amberStartDate);
							end = new Date(response.redStartDate);
							item.progressBar = calcProgress(start, end);                          
                                break;
                            case 'Red':
							start = new Date(response.redStartDate);
							end = new Date(response.blueStartDate);
							item.progressBar = calcProgress(start, end);
                                break;
                            case 'Blue':
							start = response.blueStartDate;
							end = response.blackStartDate;
							item.progressBar = calcProgress(start, end);
                                break;
                            case 'Black':
							start = response.blackStartDate;
							end = response.blackAllEnd;
							item.progressBar = calcProgress(start, end);
                        }
                    }, 
                    function(errResponse){
                        console.log(errResponse);
                    }
                );
			});

		};


      	vm.rowSelect = function(event){
      		vm.patentInfoContent = true;
      		if(!$(event.target).hasClass('cartbtn')) {
	      		var id = ($($(event.currentTarget).find('a')));
	      		var patentId = id[0].hash; //gets data from ui-sref
	      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
      		}
      	};

	   	vm.sortType = function(column) {
	   		if(column == 'dueDate') {
	   			vm.selectedSortType = (function() {

	   				vm.sortDate = true;

	   				if (vm.sortReverse === false) {
	   					vm.tableData.sort(function(a, b){
	   						var dateA = new Date(a.renewalDueDate), dateB = new Date(b.renewalDueDate);
	   						return dateB - dateA;
	   					});
	   				} else {
	   					vm.tableData.sort(function(a, b){
	   						var dateA = new Date(a.renewalDueDate), dateB = new Date(b.renewalDueDate);
	   						return dateB - dateA;
	   					});
	   				}
	   				
	   			}());
	   		} else {
	   			vm.sortDate = false;
	   			vm.selectedSortType = column;
	   		}
	   	};

   		vm.selectedSortType = 'patentApplicationNumber';
	  	vm.sortReverse  =  false;
	}
]});

app.directive('fixedTableHeaders', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $timeout(function () {
        
          var container = element.parentsUntil(attrs.fixedTableHeaders);
	        element.stickyTableHeaders({ scrollableArea: container, "fixedOffset": 0 });

      }, 0);
    }
  };
}]);