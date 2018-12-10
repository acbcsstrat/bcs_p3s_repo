angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patents', 'currentTransactionsService', 'patentsService', 'dashboardService', 'selectPhaseService', 'organiseTextService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patents, currentTransactionsService, patentsService, dashboardService, selectPhaseService,  organiseTextService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';
	vm.fetchItemTransaction = fetchItemTransaction;
	vm.patent = dashboardService.getPatent();
    vm.actionStatus = actionStatus;

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }

	$scope.$on('updateCost', function(e, o){
    	vm.patent = dashboardService.getPatent();
    	if(vm.patent.renewalFeeUI !== null) {
    		vm.patent.serviceCost = vm.patent.renewalFeeUI;
    	} else {
    		vm.patent.serviceCost = vm.patent.form1200FeeUI;
    	}
	})


	$scope.$on('updatePhase', function(e, o){
        if(selectPhaseService.getPhase().patents.length === 0) {
 		    vm.serviceCost = null;
		}
	});

    function fetchItemTransaction(id) {
        currentTransactionsService.fetchCurrentTransactions()
        .then(
            function(response) {

                var transaction = response.filter(function(el){
                    return el.renewalUIs.find(function(item) {
                        return item.patentUI.id === id;
                    })
                })

                if(transaction !== undefined || typeof transaction !== 'undefined') {
                    $state.go('current-transactions.current-transaction-item',{transId: transaction[0].id}) //if match, go current-transaction-item
                    .then(
                        function(response){
                            $timeout(function() {
                                $location.hash('currTransAnchor'); 
                                $anchorScroll();  //scroll to anchor href
                            }, 300);
                        },
                        function(errResponse){
                            console.log(errResponse);
                        }
                    );
                }

            },
            function(errResponse) {
                console.log(errResponse);
            }
        );
    };    

}
