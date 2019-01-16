angular.module('ppApp').controller('renewalCostCtrl', renewalCostCtrl);

renewalCostCtrl.$inject = ['$scope', '$timeout', '$state', '$location', '$anchorScroll', 'patentIds','currentTransactionsService', 'patentsRestService', 'dashboardService', 'organiseTextService',  'patentPhasesService']

function renewalCostCtrl($scope, $timeout, $state, $location, $anchorScroll, patentIds, currentTransactionsService, patentsRestService, dashboardService, organiseTextService,  patentPhasesService) {

	var vm = this;

	vm.fxTimeFrame = 'Today';
	vm.fetchItemTransaction = fetchItemTransaction;
    vm.actionStatus = actionStatus;
    vm.paymentStatus = paymentStatus;
    vm.loading = true;
    vm.noPatents = false;
    vm.patent;

    function init() {
        if(patentIds.length == 0) {
            vm.noPatents = true;
        }
    }

    init();


    $scope.$on('updateCost', function(e, o){

        if(patentPhasesService.getPatent !== null) {
            vm.cartService = null;
            var patentId =  patentPhasesService.getPatent.id;

            patentsRestService.fetchPatentItem(patentId)
            .then(
                function(response){
                    return response;
                })
            .then(
                function(patent){
                    if(patent == null || patent == undefined) {
                        vm.patent = null;
                        return
                    }
                    vm.patent = patent;
                    if(vm.patent !== undefined || typeof vm.patent !== 'undefined') {
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
                    }
                    vm.loading = false;
                }
            )
        }

    })

    $scope.$on('updatePhase', function(e, o){
        if(patentPhasesService.getPatents === null) {
            vm.patent.serviceCost = null;
        }
    });

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
