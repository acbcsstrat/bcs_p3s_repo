angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll',  'currentTransactionsService', 'patentsService', 'dashboardService', 'selectPhaseService', 'organiseTextService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, currentTransactionsService, patentsService, dashboardService, selectPhaseService,  organiseTextService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';
	vm.fetchItemTransaction = fetchItemTransaction;
	vm.patent = dashboardService.getPatent();
    vm.actionStatus = actionStatus;
    vm.paymentStatus = paymentStatus;

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }

    function paymentStatus(text) {
        return organiseTextService.paymentStatus(text)
    }    

	$scope.$on('updateCost', function(e, o){
        vm.cartService = null;
    	vm.patent = dashboardService.getPatent();
    	if(vm.patent.renewalFeeUI !== null) {
            if(actionStatus(vm.patent.renewalStatus) && vm.patent.renewalStatus !== ('Payment in progress' && 'EPO Instructed')) {
                vm.cartService = 'Renewal';
            }
    		vm.patent.serviceCost = vm.patent.renewalFeeUI;
    	} else {
            if(actionStatus(vm.patent.epctStatus) && vm.patent.epctStatus !== ('Payment in progress' && 'EPO Instructed' && 'Epct being generated' && 'Epct available')) {
                vm.cartService = 'Epct';
            }
    		vm.patent.serviceCost = vm.patent.form1200FeeUI;
    	}
	})

	$scope.$on('updatePhase', function(e, o){
        if(selectPhaseService.getPhase().patents.length === 0) {
 		    vm.patent.serviceCost = null;
		}
	});

    function fetchItemTransaction(id) {
        currentTransactionsService.fetchCurrentTransactions()
        .then(
            function(response) {

                var match = response.filter(function(el){
                    return el.serviceUIs.find(function(item){
                        return item.patentUI.id === id;
                    })
                })

                if(match !== undefined || typeof match !== 'undefined') {
                    $state.go('current-transactions.current-transaction-item',{transId: match[0].id}) //if match, go current-transaction-item
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
