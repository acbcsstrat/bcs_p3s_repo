angular.module('ppApp').controller('caseOverviewCtrl', caseOverviewCtrl);

caseOverviewCtrl.$inject = ['patent', '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService', 'renewalRestService', 'activeTabService']

function caseOverviewCtrl(patent, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService, renewalRestService, activeTabService) {

    var vm = this;

    vm.patent = patent;

    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.getStatus = getStatus;
    vm.refreshChart = refreshChart;
    vm.servicesAvailable = true;

    function refreshChart (){
        $timeout(function(){  
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 300)
    }

    function init() {
        if(activeTabService.getTab == 2) {
            $scope.activeLeft = 2
            activeTabService.setTab(0)
        } else if(activeTabService.getTab == 3) {
            $scope.activeLeft = 3;
            activeTabService.setTab(0)
        } else {
            $scope.activeLeft = 0;
        }

        // vm.patent.portfolioUI.serviceList[1] = {
        //     costBandEndDate: 1571353200000,
        //     costBandEndDateUI: "Fri Oct 18, 2019",
        //     currentOfficialFeeEUR: 17347.5,
        //     currentOfficialFeeUSD: 21334.1046675,
        //     currentStageColour: "Green",
        //     currentStageCostUSD: 22309.1,
        //     failedReason: null,
        //     nextStageColour: "Amber",
        //     nextStageCostUSD: 24330.02,
        //     serviceStatus: "Epct available",
        //     serviceType: "Form1200"
        // }

        // vm.patent.form1200FeeUI = {
        //     costHistoryUI: {fxRateYesterday: 0.818845, subTotalEURYesterday: 1808.91, subTotalUSDYesterday: 2209.1, fxRateLastWeek: 0.818845, subTotalEURLastWeek: 1808.91},
        //     currentOfficialFeeEUR: 1747.5,
        //     currentOfficialFeeUSD: 21434.1046675,
        //     dollarComponentUSD: 745,
        //     euroComponentEUR: 17447.5,
        //     expressFeeEUR: 0,
        //     expressFeeUSD: 0,
        //     expressFee_USD: 0,
        //     extensionFeeEUR: 5842.5,
        //     extensionFeeUSD: 7141.37,
        //     extensionFee_EUR: 5482.5,
        //     extensionFee_USD: 7411.37,
        //     feeActiveDate: null,
        //     fxRate: 0.818845,
        //     latePayPenaltyEUR: null,
        //     latePayPenaltyUSD: null,
        //     latePayPenalty_USD: null,
        //     ppFeesEUR: 641.41000000000008,
        //     ppFeesUSD: 744.99533250000013,
        //     processingFeeEUR: 61.41,
        //     processingFeeUSD: 745,
        //     processingFee_USD: 75,
        //     renewalFeeEUR: 1165,
        //     renewalFeeUSD: 14422.74,
        //     renewalFee_EUR: 11465,
        //     renewalFee_USD: 14422.74,
        //     savings: 2240.92000000000007,
        //     subTotalEUR: 1808.91,
        //     subTotalUSD: 2209.1,
        //     subTotal_USD: 2209.1,
        //     urgentFeeEUR: 0,
        //     urgentFeeUSD: 0,
        //     urgentFee_USD: 0
        // }

        $scope.availableServices = (function() {
            return vm.patent.portfolioUI.serviceList.map(function(data, index){
               return {id: index, action: data.serviceType, status: data.serviceStatus}
            })
        }())

        vm.statusesAvailable = $scope.availableServices;

        if($scope.availableServices.length === 0) {
            vm.servicesAvailable = false;
        }

        renewalRestService.fetchHistory(patent.id) //needs to be invoked outside of availableServices. A service wont be available even if there is renewal history
        .then(
            function(response){
                if(response.length > 0) {
                   vm.displayRenewalHistoryTab = true;
                   return;
                }
                vm.displayRenewalHistoryTab = false;
            }
        )        

        $scope.availableServices.forEach(function(obj){

            if(obj.action == 'Form1200') {
                $scope.availableServices.forEach(function(obj){
                    if((organiseTextService.actionStatus(obj.status) && obj.action == 'Form1200') || (obj.status == 'Epct being generated' && obj.action == 'Form1200')) {
                        vm.displayForm1200Tab = true;
                        return;
                    }
                    vm.displayForm1200Tab = false;
                })   
            }
        })
    }

    init()

    function getStatus(text) {
        return organiseTextService.uiStatus(text);
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

    function confirmDeletePatent(id) {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.confirm-delete-patent.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

                this.deletePatent = function() {
                    deletePatent(id);
                    $timeout(function() {
                        $uibModalInstance.close();
                    }, 300);
                };

                this.cancelDeletion = function() {
                    $uibModalInstance.dismiss('cancel');
                };

            }]
        });
    };

    function deletePatent(id){

        patentsRestService.deletePatent(id)
        .then(
            function(){
                $state.go('portfolio', {}, {reload: true})
                .then(function(){
                    $timeout(function(){
                        patentsRestService.fetchAllPatents()
                    }, 400);
                });
            },
            function(errResponse){
                deletePatentError(errResponse);
            }
        );
    };

    function deletePatentError(errResponse) {

        if(errResponse.status === 304) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.delete-patent-error-trans.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', function($uibModalInstance) {

                    // vm.updatePatent(id); DONT THINK IS NEEDED

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        } else {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.delete-patent-error.tpl.htm',
                appendTo: undefined,
                controllerAs: '$ctrl',
                controller: ['$uibModalInstance', function($uibModalInstance) {

                    // vm.updatePatent(id); DONT THINK IS NEEDED

                    this.dismissModal = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        }

    }


    
}