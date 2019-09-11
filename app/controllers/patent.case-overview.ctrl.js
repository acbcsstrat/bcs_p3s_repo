angular.module('ppApp').controller('caseOverviewCtrl', caseOverviewCtrl);

caseOverviewCtrl.$inject = ['patent', '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService', 'renewalRestService', 'activeTabService', 'organiseColourService']

function caseOverviewCtrl(patent, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService, renewalRestService, activeTabService, organiseColourService) {

    var vm = this;

    vm.patent = patent;


    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
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

        // patent.serviceList = { // TEST DATA FOR GRANT
        //     costBandEndDate: 1565910000000,
        //     costBandEndDateUI: "Fri Aug 16, 2019",
        //     currentOfficialFeeEUR: 2362.5,
        //     currentOfficialFeeUSD: 2885.1629625,
        //     currentStageColour: "Gren",
        //     currentStageCostUSD: 2960.16,
        //     failedReason: null,
        //     nextStageColour: "Amber",
        //     nextStageCostUSD: 3256.18,
        //     serviceStatus: "Grant saved",
        //     serviceType: "Grant",
        //     epoFeeCodes: [
        //         {name: '007'},
        //         {name: '008'},
        //         {name: '016'},
        //     ],
        //     fees: { //!!!!!!!! TEST DATA FOR GRANT
        //         currentOfficialFeeEUR: 2362.5,
        //         currentOfficialFeeUSD: 2885.1629625,
        //         expressFeeEUR: 0,
        //         expressFeeUSD: 0,
        //         extensionFeeEUR: 787.5,
        //         extensionFeeUSD: 961.72,
        //         fxRate: 0.818845,
        //         latePayPenaltyEUR: null,
        //         latePayPenaltyUSD: null,
        //         processingFeeEUR: 61.41,
        //         processingFeeUSD: 75,
        //         subTotalEUR: 2423.91,
        //         subTotalUSD: 2960.16,
        //         urgentFeeEUR: 0,
        //         urgentFeeUSD: 0,
        //     }
        // }


        // patent.grantFeeUI = { //!!!!!!!! TEST DATA FOR GRANT
        //     currentOfficialFeeEUR: 2362.5,
        //     currentOfficialFeeUSD: 2885.1629625,
        //     dollarComponentUSD: 75,
        //     euroComponentEUR: 2362.5,
        //     expressFeeEUR: 0,
        //     expressFeeUSD: 0,
        //     extensionFeeEUR: 787.5,
        //     extensionFeeUSD: 961.72,
        //     feeActiveDate: null,
        //     fxRate: 0.818845,
        //     latePayPenaltyEUR: null,
        //     latePayPenaltyUSD: null,
        //     processingFeeEUR: 61.41,
        //     processingFeeUSD: 75,
        //     renewalFeeEUR: 1575,
        //     renewalFeeUSD: 1923.44,
        //     subTotalEUR: 2423.91,
        //     subTotalUSD: 2960.16,
        //     urgentFeeEUR: 0,
        //     urgentFeeUSD: 0
        // }

        if(activeTabService.getTab == 2) {
            $scope.activeLeft = 2
            activeTabService.setTab(0)
        } else if(activeTabService.getTab == 3) {
            $scope.activeLeft = 3;
            activeTabService.setTab(0)
        } else {
            $scope.activeLeft = 0;
        }

        if($stateParams.form1200generate === 1) {
            $scope.activeLeft = 2;
            activeTabService.setTab(0)
        }

        if($stateParams.grantOrder === 1) {
            $scope.activeLeft = 4;
            activeTabService.setTab(0)
        }        

        patent.action = organiseTextService.actionStatus(patent.portfolioUI.serviceStatus) ? true : false; 
        patent.uiStatus = organiseTextService.uiStatus(patent.portfolioUI.serviceStatus);
        if(patent.portfolioUI.serviceList.length > 0) {
            patent.cssCurrent = organiseColourService.getCurrColour(patent.portfolioUI.serviceList[0].currentStageColour, 'text')
            patent.cssNext = organiseColourService.getCurrColour(patent.portfolioUI.serviceList[0].nextStageColour, 'text')
        }

        patent.urgentAttentionReq = (function(){

            if(patent.portfolioUI.serviceStatus == 'Too late to renew') {
                return true;
            }
            if(patent.portfolioUI.serviceStatus == 'Too late') {
                if(patent.portfolioUI.serviceList.length > 0) {
                    if(patent.portfolioUI.serviceList[0].currentStageColour == 'Red') {
                        return true
                    }
                }

            }
            return false
        }())

        patent.manualProcess = patent.portfolioUI.serviceStatus === 'Epct not available' ? true : false;

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
                
                    if((organiseTextService.actionStatus(obj.status) && obj.action == 'Form1200') || (obj.status == 'Epct being generated' && obj.action == 'Form1200')) {
                        vm.displayForm1200Tab = true;
                        return;
                    }
                    vm.displayForm1200Tab = false;
           
            }

            if(obj.action == 'Grant and Publishing Fees') { // !!!!!! GRANT TEST DATA
                vm.displayGrantTab = true;
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