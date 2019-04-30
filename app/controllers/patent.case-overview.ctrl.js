angular.module('ppApp').controller('caseOverviewCtrl', caseOverviewCtrl);

caseOverviewCtrl.$inject = ['patent', '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService']

function caseOverviewCtrl(patent, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService) {

    var vm = this;

    vm.patent = patent;

    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.updatePatent = updatePatent;
    vm.editItem = editItem;
    vm.doneEditing = doneEditing;
    vm.getStatus = getStatus;

    vm.editing = [];
    vm.statusesAvailable = [];

    $scope.availableServices = (function() {    
        // vm.patent.portfolioUI.serviceList.push({
        //    costBandEndDate: 1579132800000,
        //     costBandEndDateUI: "Thu Jan 16, 2020",
        //     currentOfficialFeeEUR: 2530,
        //     currentOfficialFeeUSD: 3089.71949,
        //     currentStageColour: "Green",
        //     currentStageCostUSD: 3164.71949,
        //     failedReason: null,
        //     nextStageColour: "Amber",
        //     nextStageCostUSD: 3473.691439,
        //     serviceStatus: "show price",
        //     serviceType: "Renewal"

        //     })

        return vm.patent.portfolioUI.serviceList.map(function(data, index){
           return {id: index, action: data.serviceType}
        })
    }())    

    function getStatus(text) {
        return organiseTextService.uiStatus(text);
    }

    vm.$onInit = function() {

        if(patent.renewalFeeUI === null && patent.form1200FeeUI === null) {
            patent.availableFee = null;
            return;
        }

        var patentService = patent.portfolioUI.serviceList[0];

        patent.portfolioUI.serviceList.forEach(function(el){
            if(organiseTextService.actionStatus(el.serviceStatus)) {
                vm.statusesAvailable.push(el.serviceStatus)
            }
        })

        patent.availableFee = {};
        patent.availableFee.costBandEndDateUI = patentService.costBandEndDateUI;

        if(patent.renewalFeeUI !== null) {
            patent.availableFee.savings = (function(){
                if((patentService.currentStageColour == 'Black' && patentService.serviceStatus == 'Show price') || (patentService.currentStageColour !== 'Black')) {
                    if(patentService.nextStageCostUSD !== 0) {
                        return patentService.nextStageCostUSD - patentService.currentStageCostUSD;
                    }
                    return 0;
                }
                return 0;
            }())
            patent.availableFee.title = 'Regional Renewal';
            patent.availableFee.fee = patent.renewalFeeUI;
            patent.availableFee.costHistoryUI = patent.renewalFeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.renewalFeeUI.fxRate;
            patent.ppFees = {
                USD: (function(){
                    var total = patent.renewalFeeUI.processingFeeUSD;
                    if(patent.renewalFeeUI.urgentFeeUSD !== 0) {total += patent.renewalFeeUI.urgentFeeUSD}
                    if(patent.renewalFeeUI.expressFeeUSD !== 0) {total += patent.renewalFeeUI.expressFeeUSD}
                    return total;
                }()),
                EUR: (function(){
                    var total = patent.renewalFeeUI.processingFeeEUR
                    if(patent.renewalFeeUI.urgentFeeEUR !== 0) total += patent.renewalFeeUI.urgentFeeEUR;
                    if(patent.renewalFeeUI.expressFeeEUR !== 0) total += patent.renewalFeeUI.expressFeeEUR;
                    return total;
                }())
            }

        }

        if(patent.form1200FeeUI !== null) {
            patent.availableFee.savings = (function(){
                if(patentService.currentStageColour !== 'Red') {                
                    if(patentService.nextStageCostUSD !==0) {
                        return patentService.nextStageCostUSD - patentService.currentStageCostUSD;
                    }
                    return 0;
                }
                return 0;
            }())
            patent.availableFee.title = 'Form 1200';
            patent.availableFee.fee = patent.form1200FeeUI;
            patent.availableFee.costHistoryUI = patent.form1200FeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.form1200FeeUI.fxRate;
            patent.ppFees = {
                USD: (function(){
                    var total = patent.form1200FeeUI.processingFeeUSD;
                    if(patent.form1200FeeUI.urgentFeeUSD !== 0) total += patent.form1200FeeUI.urgentFeeUSD;
                    if(patent.form1200FeeUI.expressFeeUSD !== 0) total += patent.form1200FeeUI.expressFeeUSD;
                    return total;
                }()),
                EUR: (function(){
                    var total = patent.form1200FeeUI.processingFeeEUR;
                    if(patent.form1200FeeUI.urgentFeeEUR !== 0) total += patent.form1200FeeUI.urgentFeeEUR;
                    if(patent.form1200FeeUI.expressFeeEUR !== 0) total += patent.form1200FeeUI.expressFeeEUR;
                    return total;
                }())
            }
        }        
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

    function updatePatent(patent) {

        patentsRestService.updatePatent(patent, patent.id)
        .then(
            function(response){
                updatePatentSuccess();
            },
            function(errResponse){
                updatePatentError();
            }
        )

    };

    function updatePatentSuccess() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-patent-success.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                    $state.reload()
                };

            }]

        });
        
    }

    function updatePatentError() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-patent-error.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });

    }

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

    function editItem(index) {
        vm.editing[index] = true;
    };

    function doneEditing(index) {
        vm.editing[index] = false;
    };
    
}