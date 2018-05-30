angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patents', 'transactionHistory', 'currentTransactions', 'calculateService', 'patentsRestService'];

function recentActivityCtrl(patents, transactionHistory, currentTransactions, calculateService, patentsRestService) {

	var vm = this;

	var date = new Date().getTime();

	vm.recentTransArr = [];
	vm.recentRenewalArr = [];
    vm.recentStageArr = [];
    vm.setActivityActiveTab = setActivityActiveTab;

    console.log()
    
    vm.activityNotifications = [
		{
			activity: 'Stage Change',
			index: 0
		},
		{
			activity: 'Transactions',
			index: 1
		},
		{	
			activity: 'Renewals',
			index: 2
		}
	]

	vm.activeMenu = vm.activityNotifications[0].activity;

	if(patents) {
		patents.forEach(function(data){
			patentsRestService.fetchCostAnalysis(data.id)
			.then(
				function(response, i){
        			if(data.renewalStatus == 'Show price') {
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

	if(currentTransactions) {
		currentTransactions.forEach(function(data){
			var hours =  date - data.lastUpdatedDate;
			var recentTrans  = calculateService.recentActivity(hours);
			if(recentTrans) {
				vm.recentTransArr.push(data);
			}
		});	
	}

	if(transactionHistory) {
		transactionHistory.forEach(function(data){
			var hours =  date - data.lastUpdatedDate;
			var recentRenewal = calculateService.recentActivity(hours);			
			if(recentRenewal && data.latestTransStatus === 'Completed') {
				vm.recentRenewalArr.push(data);
			}
		})
	}

	function setActivityActiveTab (menuItem, index) {
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
