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

        // if(patent.portfolioUI.serviceList) {       

        //         patent.serviceStatus = 'Show price';
        //         patent.epeStage = 'Prosecution';
        //         patent.serviceList = [{
        //             costBandEndDate: 1578960000000,
        //             costBandEndDateUI: "Tue Jan 14, 2020",
        //             cssCurrent: "txt-phase-green",
        //             cssNext: "txt-phase-amber",
        //             currentOfficialFeeEUR: 2530,
        //             currentOfficialFeeUSD: 3089.71949,
        //             currentStageColour: "Green",
        //             currentStageCostUSD: 3164.71949,
        //             failedReason: null,
        //             isUrgentAttention: false,
        //             nextStageColour: "Amber",
        //             nextStageCostUSD: 3473.691439,
        //             saleType: "Online",
        //             serviceStatus: "Show price",
        //             serviceType: "Renewal",
        //             serviceStatusUI: "Open for Renewal"
        //         }];
        //         // if(patent.renewalFeeUI) {
        //             var feeUIarr = {}; // {} will create an object
        //             var feeUI = 'renewalFeeUI';
        //             var val = patent.renewalFeeUI;
        //             feeUIarr[feeUI] = val;
        //             patent.serviceList.push(feeUIarr)
        //         // }
        //         console.log(patent)
        //         patent.P3SserviceWithFees = patent.serviceList;
        //         delete patent.serviceList;
                patent.P3SserviceWithFees.map(function(list){
                    // list.saleType = 'Online';
                    // list.actionable = organiseTextService.actionStatus(list.serviceStatus) ? true : false;
                    // list.uiStatus = organiseTextService.uiStatus(list.serviceStatus);
                    // list.uiStatus = organiseTextService.uiStatus(list.serviceStatus);
                    // list.isUrgentAttention = list.currentStageColour === 'Red' ? true : false;                
                    if(list.currentStageColour) {
                        list.cssCurrent = organiseColourService.getCurrColour(list.currentStageColour, 'text')
                    }
                    if(list.nextStageColour) {
                        list.cssNext = organiseColourService.getCurrColour(list.nextStageColour, 'text')
                    }
                })

  
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

        $scope.availableServices = (function() {
            console.log(vm.patent)
            return vm.patent.P3SserviceWithFees.map(function(data, index){
               return {id: index, action: data.serviceType, status: data.serviceStatus}
            })
        }())        

        vm.statusesAvailable = $scope.availableServices;

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