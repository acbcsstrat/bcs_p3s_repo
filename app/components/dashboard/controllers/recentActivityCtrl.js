function recentActivityCtrl(patents, transactionHistory, calculateService, patentsRestService) {

	var vm = this;

	vm.recentTransArr = [];
	vm.recentRenewalArr = [];
    vm.recentStageArr = [];

    var date = new Date().getTime();

	vm.$onInit = function() {

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
	
	}; //$onInit end


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
	];

	vm.activeMenu = vm.activityNotifications[0].activity;

	vm.setActivityActiveTab = function(menuItem, index) {
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}

angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);