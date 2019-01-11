angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patentIds', 'calculateService', 'patentsRestService', 'coreService', 'transactionHistoryService', 'currentTransactionsService'];

function recentActivityCtrl(patentIds, calculateService, patentsRestService, coreService, transactionHistoryService, currentTransactionsService) {

	var vm = this;

	var date = new Date().getTime();

	vm.recentTransArr = [];
	vm.recentRenewalArr = [];
    vm.recentStageArr = [];
    vm.setActivityActiveTab = setActivityActiveTab;
	vm.changeActivity = changeActivity;
    vm.activityNotifications = [
		{
			activity: 'Stage Change',
			index: 0,
			function: 'recentStageChanges'
		},
		{
			activity: 'Transactions',
			index: 1,
			function: 'recentTransactions'			
		},
		{	
			activity: 'Renewals',
			index: 2,
			function: 'recentRenewals'			
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

        recentStageChanges()

	}

	function changeActivity(activity) {

		if(activity == 'Stage Change') {
			recentStageChanges();
			return
		}

		if(activity == 'Transactions') {
			recentTransactions();
			return
		}

		if(activity == 'Renewals') {
			recentRenewals();
			return
		} 
	}

	function recentStageChanges() {

		if(patentIds.length > 0) {
			patentIds.forEach(function(data){
				patentsRestService.fetchCostAnalysis(data.id)
				.then(
					function(response, i){
	        			if(data.renewalStatus == 'Show price' || data.renewalStatus == 'Too late to renew' || data.epctStatus == 'Epct available' || data.epctStatus == 'Epct rejected' || data.epctStatus == 'Epct saved') {
	        				var hours = calculateService.calculateHours(data.costBandColour, response);
	    					if(calculateService.recentActivity(hours)) {
	    						vm.recentStageArr.push(data);
	    					}
	        			}
					},
					function(errResponse) {
						// body...
					}
				);
			})
		}

	}

	function recentTransactions() {

		if(currentTransactions.length > 0) {
			currentTransactions.forEach(function(data){
				var hours =  date - data.lastUpdatedDate;
				var recentTrans  = calculateService.recentActivity(hours);
				if(recentTrans) {
					vm.recentTransArr.push(data);
				}
			});	
		}

	}

	function recentRenewals() {

		if(transactionHistory.length > 0) {
			transactionHistory.forEach(function(data){
				var hours =  date - data.lastUpdatedDate;
				var recentRenewal = calculateService.recentActivity(hours);			
				if(recentRenewal && data.latestTransStatus === 'Completed') {
					vm.recentRenewalArr.push(data);
				}
			})
		}

	}

	function setActivityActiveTab (menuItem, index) {
        vm.activeActivityTab = index;
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
