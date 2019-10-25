angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patentIds', 'calculateService', 'costAnalysisService', 'transactionHistoryService', 'currentTransactionsService'];

function recentActivityCtrl(patentIds, calculateService, costAnalysisService, transactionHistoryService, currentTransactionsService) {

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
				patent.p3sServices.forEach(function(service){
					if(service.saleType !== 'Not In Progress' && service.saleType !== 'In Progress') {
						costAnalysisService.fetchCa(patent.patentID, patent.p3sServices)
						.then(
							function(response, i){
		        				var hours = calculateService.calculateHours(service.currentStageColour, response[0].data);
		    					if(calculateService.recentActivity(hours)) {
		    						vm.recentActivityData.push(patent);
		    					}
							},
							function(errResponse) {
								console.error('Error finding recent activites:', errResponse)
							}
						);
					}
				})
			})
		}
	}

	function fetchTransChanges() {

		vm.recentTransArr = [];
		currentTransactions
		.then(
			function(response){
				if(response.length > 0) {
					response.forEach(function(data){
						var hours =  new Date().getTime() - data.lastUpdatedDate;
						var recentTrans  = calculateService.recentActivity(hours);
						if(recentTrans) {
							vm.recentTransArr.push(data);
						}
					});	
				}
			},
			function(errResponse) {
				console.error('Error finding recent transactions: ', errResponse)
			}
		)


	}

	function setActivityActiveTab (menuItem, index) {
        vm.activeActivityTab = index;
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
