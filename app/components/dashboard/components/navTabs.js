app.component('activityTabs', {
	require: { 
		dashCtrl: '^dashboard'
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/activity-tabs.htm',
	controller: function(patentsRestService) {

		var vm = this;

		vm.recentTransArr = [];
		vm.recentRenewalArr = [];
	    vm.recentStageArr = [];

		function recentActivityFn(millisec) {

	        var seconds = (millisec / 1000).toFixed(0);
	        var minutes = Math.floor(seconds / 60);
	        var hours = "";

	        if (minutes > 59) {
	            hours = Math.floor(minutes / 60);
	            hours = (hours >= 10) ? hours : "0" + hours;
	            minutes = minutes - (hours * 60);
	            minutes = (minutes >= 10) ? minutes : "0" + minutes;
	        }

	        seconds = Math.floor(seconds % 60);
	        seconds = (seconds >= 10) ? seconds : "0" + seconds;

	        if (hours < 48) {
	            return true;
	        }

	    }

		function patentCostAnalysisFn(patents, id) {
			patentsRestService.fetchCostAnalysis(id)
			.then(
				function(response, i){
            		patents.forEach(function(item, i) {
            			if(item.renewalStatus == 'Show price') {
            				if(item.id == id) {
            					if(recentActivityFn(item, hours)) {
            						vm.recentStageArr.push(item);
            					}
            				}
            			}
            		})
				},
				
				function(errResponse) {
					// body...
				}
			);
		}	    	

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
			vm.activeActivityTabResp = index;
			vm.activeMenu = menuItem;
		};

	}
})