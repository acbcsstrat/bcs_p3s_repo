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


            // patent.serviceStatus = 'Grant available';
            // patent.epeStage = 'Grant';
            // patent.grantFeeUI = {

            //     claimsFee1EUR: 0,
            //     claimsFee1USD: 0,
            //     claimsFee2EUR: 0,
            //     claimsFee2USD: 0,
            //     currentOfficialFeeEUR: 2530,
            //     currentOfficialFeeUSD: 3089.71949,
            //     designationFeeEUR: 585,
            //     designationFeeUSD: 714.42,
            //     dollarComponentUSD: 75,
            //     euroComponentEUR: 2530,
            //     examinationFeeEUR: 1825,
            //     examinationFeeUSD: 2228.75,
            //     excessPageFeeEUR: 0,
            //     excessPageFeeUSD: 0,
            //     expressFeeEUR: 0,
            //     expressFeeUSD: 0,
            //     extensionFeeEUR: 0,
            //     extensionFeeUSD: 0,
            //     filingFeeEUR: 120,
            //     filingFeeUSD: 146.55,
            //     fxRate: 0.818845,
            //     processingFeeEUR: 61.41,
            //     processingFeeUSD: 75,
            //     renewalFeeEUR: 0,
            //     renewalFeeUSD: 0,
            //     subTotalEUR: 2591.41,
            //     subTotalUSD: 3164.72,
            //     supplementarySearchFeeEUR: 0,
            //     supplementarySearchFeeUSD: 0,
            //     urgentFeeEUR: 0,
            //     urgentFeeUSD: 0,
            //     validationFeeEUR: 0,
            //     validationFeeUSD: 0
            // }
            // patent.serviceList = [{
            //     actionable: false,
            //     costBandEndDate: 1580774400000,
            //     costBandEndDateUI: "Tue Feb 4, 2020",
            //     cssCurrent: "txt-phase-green",
            //     cssNext: "txt-phase-amber",
            //     currentOfficialFeeEUR: 4300,
            //     currentOfficialFeeUSD: 5251.3019,
            //     currentStageColour: "Green",
            //     currentStageCostUSD: 5326.3019,
            //     failedReason: null,
            //     nextStageColour: "Amber",
            //     nextStageCostUSD: 5851.43209,
            //     serviceStatus: "Grant available",
            //     serviceType: "Grant",
            //     uiStatus: "Grant available",
            //     urgentAttention: false
            // }]
            patent.P3SserviceWithFees = patent.portfolioUI.serviceList;
            delete patent.serviceList;
            patent.P3SserviceWithFees.map(function(list){
                list.actionable = organiseTextService.actionStatus(list.serviceStatus) ? true : false;
                list.uiStatus = organiseTextService.uiStatus(list.serviceStatus);
                list.urgentAttention = list.currentStageColour === 'Red' ? true : false;
                if(list.currentStageColour) {
                    list.cssCurrent = organiseColourService.getCurrColour(list.currentStageColour, 'text')
                }
                if(list.nextStageColour) {
                    list.cssNext = organiseColourService.getCurrColour(list.nextStageColour, 'text')
                }
            })


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

        if(patent.P3SserviceWithFees.length > 0) {
            patent.cssCurrent = organiseColourService.getCurrColour(patent.P3SserviceWithFees[0].currentStageColour, 'text')
            patent.cssNext = organiseColourService.getCurrColour(patent.P3SserviceWithFees[0].nextStageColour, 'text')
        }

        patent.urgentAttentionReq = (function(){

            if(patent.serviceStatus == 'Too late to renew') {
                return true;
            }
            if(patent.serviceStatus == 'Too late') {
                if(patent.P3SserviceWithFees.length > 0) {
                    if(patent.P3SserviceWithFees[0].currentStageColour == 'Red') {
                        return true
                    }
                }

            }
            return false
        }())

        patent.manualProcess = patent.serviceStatus === 'Epct not available' ? true : false;

        $scope.availableServices = (function() {
            return vm.patent.P3SserviceWithFees.map(function(data, index){
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

            if(obj.action == 'Grant') {
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