RecentActvityController.$inject = ['CalculateService', 'CostAnalysisService', 'TransactionHistoryService', 'CurrentTransactionsService', '$stateParams'];

export default function RecentActvityController(CalculateService, CostAnalysisService, TransactionHistoryService, CurrentTransactionsService, $stateParams) {

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
        return TransactionHistoryService.fetchTransactionHistory();
    }())
    var currentTransactions = (function() {
        return CurrentTransactionsService.fetchCurrentTransactions();
    }())

    function init() {
    	fetchStageChanges($stateParams.patents)
    }

    init();

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

	function fetchStageChanges(patents) {

		vm.recentActivityData = [];

		if(patents.length > 0) {
			patents.forEach(function(patent){
				patent.p3sServices.forEach(function(service){
					if(service.saleType !== 'Not In Progress' && service.saleType !== 'In Progress') {
						CostAnalysisService.fetchCa(patent.patentID, patent.p3sServices)
						.then(
							function(response, i){
		        				var hours = CalculateService.calculateHours(service.currentStageColour, response[0].data);
		    					if(CalculateService.recentActivity(hours)) {
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
						var recentTrans  = CalculateService.recentActivity(hours);
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
