angular.module('ppApp').controller('recentActivityCtrl', recentActivityCtrl);

recentActivityCtrl.$inject = ['patents', 'transactionHistory', 'currentTransactions', 'calculateService', 'patentsRestService', 'coreService'];

function recentActivityCtrl(patents, transactionHistory, currentTransactions, calculateService, patentsRestService, coreService) {

	var vm = this;

	var date = new Date().getTime();

	vm.recentTransArr = [];
	vm.recentRenewalArr = [];
    vm.recentStageArr = [];
    vm.setActivityActiveTab = setActivityActiveTab;
    
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

	}

	if(patents.length > 0) {
		patents.forEach(function(data){
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

	if(currentTransactions.length > 0) {
		currentTransactions.forEach(function(data){
			var hours =  date - data.lastUpdatedDate;
			var recentTrans  = calculateService.recentActivity(hours);
			if(recentTrans) {
				vm.recentTransArr.push(data);
			}
		});	
	}

	if(transactionHistory.length > 0) {
		transactionHistory.forEach(function(data){
			var hours =  date - data.lastUpdatedDate;
			var recentRenewal = calculateService.recentActivity(hours);			
			if(recentRenewal && data.latestTransStatus === 'Completed') {
				vm.recentRenewalArr.push(data);
			}
		})
	}

	function setActivityActiveTab (menuItem, index) {
        vm.activeActivityTab = index;
		vm.activeActivityTabResp = index; //needed for responsiveness
		vm.activeMenu = menuItem;
	};	    

}
