angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patentIds','currentTransactionsService', 'dashboardService', 'organiseTextService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patentIds, currentTransactionsService, dashboardService, organiseTextService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';
	vm.fetchItemTransaction = fetchItemTransaction;
    vm.actionStatus = actionStatus;
    vm.paymentStatus = paymentStatus;

    vm.loading = true;
    vm.noPatents = true;

    function init() {
        if(patentIds.length == 0) {
            vm.noPatents = true;
        }
    }

    init();

   $scope.$on('updateCost', function(e, o){
        vm.actionCost = dashboardService.fetchActionCost();
        vm.loading = false;
    })

    function actionStatus(text) {
        return organiseTextService.actionStatus(text)
    }

    function paymentStatus(text) {
        return organiseTextService.paymentStatus(text)
    }

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
