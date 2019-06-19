angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patentIds', 'calculateService', 'costAnalysisService', 'coreService', 'transactionHistoryService', 'currentTransactionsService', 'organiseColourService'];

function recentActivityCtrl(patentIds, calculateService, costAnalysisService, coreService, transactionHistoryService, currentTransactionsService, organiseColourService) {

	var vm = this;

	vm.date = new Date().getTime();

	vm.fetchStageChanges = fetchStageChanges;
	vm.fetchTransChanges = fetchTransChanges;

    vm.setActivityActiveTab = setActivityActiveTab;
	vm.changeActivity = changeActivity;
    vm.activityNotifications = [
		{
			activity: 'Stage Change',
			index: 0,
			function: 'fetchStageChanges'
		},
		{
			activity: 'Transactions',
			index: 1,
			function: 'fetchTransChanges'			
		}
	]

	vm.activeMenu = vm.activityNotifications[0].activity;
    var transactionHistory = (function() {
        return transactionHistoryService.fetchTransactionHistory();
    }())
    var currentTransactions = (function() {
        return currentTransactionsService.fetchCurrentTransactions();
    }())

	vm.$onInit = function() {
        fetchStageChanges();
	}

	function changeActivity(activity) {
		// console.log(activity)
		if(activity == 'Stage Change') {
			fetchStageChanges();
			return;
		}

		if(activity == 'Transactions') {
			fetchTransChanges();
			return;
		}

	}

	function fetchStageChanges() {

		vm.recentActivityData = [];

		if(patentIds.length > 0) {
			patentIds.forEach(function(patent){
				costAnalysisService.fetchCa(patent)
				.then(
					function(response, i){
						if(patent.serviceList.length > 0) {
		        			if(patent.serviceStatus == 'Show price' || patent.serviceStatus == 'Too late to renew' || patent.serviceStatus == 'Epct available' || patent.serviceStatus == 'Epct rejected' || patent.serviceStatus == 'Epct saved') {
		        				var hours = calculateService.calculateHours(patent.serviceList[0].currentStageColour, response[0].data);
		    					if(calculateService.recentActivity(hours)) {
		    						vm.recentActivityData.push(patent);
		    					}
		        			}
						}
					},
					function(errResponse) {
						console.log(errResponse)
					}
				);
			})
		}
		

	}

	function fetchTransChanges() {

		vm.recentTransArr = [];
		currentTransactions
		.then(function(response){
			if(response.length > 0) {
				response.forEach(function(data){
					var hours =  new Date().getTime() - data.lastUpdatedDate;
					var recentTrans  = calculateService.recentActivity(hours);
					if(recentTrans) {
						vm.recentTransArr.push(data);
					}
				});	
			}

		})


	}

	function setActivityActiveTab (menuItem, index) {
        vm.activeActivityTab = index;
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
