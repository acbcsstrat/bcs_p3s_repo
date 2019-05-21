angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patentIds', 'calculateService', 'patentsRestService', 'coreService', 'transactionHistoryService', 'currentTransactionsService', 'organiseColourService'];

function recentActivityCtrl(patentIds, calculateService, patentsRestService, coreService, transactionHistoryService, currentTransactionsService, organiseColourService) {

	var vm = this;

	vm.date = new Date().getTime();

	vm.fetchStageChanges = fetchStageChanges;
	vm.fetchTransChanges = fetchTransChanges;
	vm.getCurrColour = getCurrColour;

    vm.recentActivityData = [];
    vm.recentTransArr = [];

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

        coreService.ppContact()
        .then(
            function(response){
                vm.partnerName = response.partnerName;
                vm.partnerPhone = response.partnerPhone;
            },
            function(errResponse){

            }
        )

        fetchStageChanges()

	}

	function getCurrColour(colour, type) {
		return organiseColourService.getCurrColour(colour, type)
	}

	function changeActivity(activity) {
		console.log(activity)
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

		vm.recentActivityData.length = 0;

		if(patentIds.length > 0) {
			patentIds.forEach(function(data){
				patentsRestService.fetchCostAnalysis(data.id)
				.then(
					function(response, i){
						if(data.serviceList.length > 0) {
		        			if(data.serviceStatus == 'Show price' || data.serviceStatus == 'Too late to renew' || data.serviceStatus == 'Epct available' || data.serviceStatus == 'Epct rejected' || data.serviceStatus == 'Epct saved') {
		        				var hours = calculateService.calculateHours(data.serviceList[0].currentStageColour, response);
		    					if(calculateService.recentActivity(hours)) {
		    						vm.recentActivityData.push(data);
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
