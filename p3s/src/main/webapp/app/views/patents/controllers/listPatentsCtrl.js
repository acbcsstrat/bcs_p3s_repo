angular.module('ppApp').controller('listPatentsCtrl', listPatentsCtrl);

listPatentsCtrl.$inject = ['$scope', '$timeout', '$http', '$rootScope',  '$state', '$anchorScroll', '$location', 'patentsRestService', 'patents', 'currentTransactionsService', 'patentsService',  'patentPhasesService'];

function listPatentsCtrl($scope, $timeout, $http, $rootScope,  $state, $anchorScroll, $location, patentsRestService, patents, currentTransactionsService, patentsService,  patentPhasesService) {

		var vm = this;

		$rootScope.page = 'List Patents';

	    $timeout(function() {
	      vm.animate = true;
	    }, 300);

		$timeout(function() {
			vm.displayPhase('all'); //invoke displayPhase displaying all patents
		}, 100);	    

	    vm.displayPhase = displayPhase;
	    vm.displayPatents = displayPatents;
	    vm.fetchItemRenewal = fetchItemRenewal;
	    vm.fetchItemTransaction = fetchItemTransaction;
	    vm.rowSelect = rowSelect;
	    vm.sortType = sortType;
   		vm.selectedSortType = 'patentApplicationNumber';
	  	vm.sortReverse  = false;	    
		vm.sortedPatentData = patentPhasesService.phases(patents);//patent data service (shared by dashboard)

  		function displayPhase(phase) {
  			vm.tableData = []; //reset data before displaying new phase
  			if(phase !== 'all') {
				switch (phase) {
				    case 'green':
				     	vm.tableData = vm.sortedPatentData.greenRenewals;
			        break;
				    case 'amber':
				     	vm.tableData = vm.sortedPatentData.amberRenewals;
			        break;
				    case 'red':
				     	vm.tableData = vm.sortedPatentData.redRenewals;
			        break;
				    case 'blue':
				     	vm.tableData = vm.sortedPatentData.blueRenewals;
				     	break;
			     	case 'black':
				    	vm.tableData = vm.sortedPatentData.blackRenewals;
				    break;
			     	case 'grey':
				    	vm.tableData = vm.sortedPatentData.greyRenewals;
				}

  			} else {
  				vm.tableData = patents;
  			}
		};

		function displayPatents() { //resets view so only list patents displays
			$state.go('patents');
		};

		function fetchItemRenewal() { // directs user to view renewals in patent item
			patentsService.activePatentItemMenu();
		};

		function fetchItemTransaction(id) { // directs user to current transaction item
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
											$location.hash('currTransAnchor'); // scrolls down to transaction item
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

      	function rowSelect(event){
      		vm.patentInfoContent = true;
      		if(!$(event.target).hasClass('cartbtn')) {
	      		var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
	      		var patentId = id[0].hash; //gets data from ui-sref
	      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
      		}
      	};

	   	function sortType(column) {
	   		if(column == 'dueDate') {
	   			vm.selectedSortType = (function() {

	   				vm.sortDate = true;

	   				if (vm.sortReverse === false) {
	   					vm.tableData.sort(function(a, b){
	   						// console.log(new Date(a.renewalDueDate).getUTCFullYear())
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
	   			vm.sortDate = false; //resets column if not selected
	   			vm.selectedSortType = column;
	   		}
	   	};



}