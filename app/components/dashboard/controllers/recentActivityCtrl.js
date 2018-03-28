angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patents', 'transactionHistory', 'calculateService', 'patentsRestService'];

function recentActivityCtrl(patents, transactionHistory, calculateService, patentsRestService) {

	var vm = this;

	vm.recentTransArr = [];
	vm.recentRenewalArr = [];
    vm.recentStageArr = [];
    vm.setActivityActiveTab = setActivityActiveTab;
    vm.activeMenu = activityNotifications()[0].activity;

    var date = new Date().getTime();

	if(patents) {

		patents.forEach(function(data){
			patentsRestService.fetchCostAnalysis(data.id)
			.then(
				function(response, i){

        			if(data.renewalStatus == 'Show price') {

        				var hours = calculateService.calculateHours(data.costBandColour, response)

    					if(calculateService.recentActivity(hours)) {
    						vm.recentStageArr.push(item);
    					}

        			}
        			
				},
				function(errResponse) {
					// body...
				}
			);
		})

	}

	if(transactionHistory) {

		transactionHistory.forEach(function(data){

			var hours =  date - data.lastUpdatedDate;
			var recentTrans  = calculateService.recentActivity(hours);

			if(recentTrans) {
				vm.recentTransArr.push(data);
			}

			if(recentTrans && data.latestTransStatus === 'Completed') {
				vm.recentRenewalArr.push(data);
			}

		});	
	}

	function activityNotifications(){

		return [
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
		];
		
	}

	function setActivityActiveTab (menuItem, index) {
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
