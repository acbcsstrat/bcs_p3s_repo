angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);

patentInfoCtrl.$inject = ['$scope', 'patent', '$state', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService']

function patentInfoCtrl($scope, patent, $state, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService) {

    var vm = this;

    vm.patent = patent;
    // vm.dirFeeBreakdown = dirFeeBreakdown;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.updatePatent = updatePatent;
    vm.editItem = editItem;
    vm.doneEditing = doneEditing;
    vm.getStatus = getStatus;

    vm.editing=[];
    vm.statusesAvailable = [];

    console.log(patent)

    if(organiseTextService.actionStatus(patent.epctStatus)) {
        vm.statusesAvailable.push(patent.epctStatus)
    }
    if(organiseTextService.actionStatus(patent.renewalStatus)) {
        vm.statusesAvailable.push(patent.renewalStatus)
    }

    function getStatus(text) {
        return organiseTextService.uiStatus(text);
    }

    vm.$onInit = function() {
        if(patent.renewalFeeUI === null && patent.form1200FeeUI === null) {
            patent.availableFee = null;
            return;
        }
        
        patent.availableFee = {};
 
        if(patent.renewalFeeUI !== null) {
            patent.availableFee.savings = (function(){
                return patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD;
            }())
            patent.availableFee.costBandEndDateUI = patent.portfolioUI.serviceList[0].costBandEndDateUI;  
            patent.availableFee.title = 'Regional Renewal';
            patent.availableFee.costHistoryUI = patent.renewalFeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.renewalFeeUI.fxRate;
            patent.availableFee.subTotalUSD = patent.renewalFeeUI.subTotalUSD;
            patent.availableFee.subTotalEUR = patent.renewalFeeUI.subTotalEUR;    
            patent.availableFee.officialFeesUSD = (function(){
                var total = 0;
                total += patent.renewalFeeUI.renewalFeeUSD;
                if(patent.renewalFeeUI.extensionFeeUSD !== 0) {
                    total += patent.renewalFeeUI.extensionFeeUSD;
                }
                return total;
            }())
            patent.availableFee.officialFeesEUR = (function(){
                var total = 0;
                total += patent.renewalFeeUI.renewalFeeEUR;
                if(patent.renewalFeeUI.extensionFeeEUR !== 0) {
                    total += patent.renewalFeeUI.extensionFeeEUR;
                }
                return total;
            }())
           patent.availableFee.ppFeesUSD = (function(){
                var total = 0;
                total += patent.renewalFeeUI.processingFeeUSD;
                if(patent.renewalFeeUI.expressFeeUSD !== 0) {
                    total += patent.renewalFeeUI.expressFeeUSD;
                }
                if(patent.renewalFeeUI.latePayPenaltyUSD !== 0) {
                    total += patent.renewalFeeUI.latePayPenaltyUSD;
                }
                if(patent.renewalFeeUI.urgentFeeUSD !== 0) {
                    total += patent.renewalFeeUI.urgentFeeUSD
                }
                return total;
            }())
            patent.availableFee.ppFeesEUR = (function(){
                var total = 0;
                total += patent.renewalFeeUI.processingFeeEUR;
                if(patent.renewalFeeUI.expressFeeEUR !== 0) {
                    total += patent.renewalFeeUI.expressFeeEUR;
                }
                if(patent.renewalFeeUI.latePayPenaltyEUR !== 0) {
                    total += patent.renewalFeeUI.latePayPenaltyEUR;
                }
                if(patent.renewalFeeUI.urgentFeeEUR !== 0) {
                    total += patent.renewalFeeUI.urgentFeeEUR
                }
                return total;
            }())
        }

        if(patent.form1200FeeUI !== null) {
            patent.availableFee.savings = (function(){
                return patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD;
            }())
            patent.availableFee.costBandEndDateUI = patent.portfolioUI.serviceList[0].costBandEndDateUI;             
            patent.availableFee.title = 'Form 1200';
            patent.availableFee.costHistoryUI = patent.form1200FeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.form1200FeeUI.fxRate;
            patent.availableFee.subTotalUSD = patent.form1200FeeUI.subTotalUSD;
            patent.availableFee.subTotalEUR = patent.form1200FeeUI.subTotalEUR;
            patent.availableFee.costBandEndDate = patent.form1200FeeUI.subTotalEUR;
            patent.availableFee.officialFeesUSD = (function(){
                var total = 0;
                total += patent.form1200FeeUI.filingFeeUSD;
                total += patent.form1200FeeUI.examinationFeeUSD;
                total += patent.form1200FeeUI.supplementarySearchFeeUSD;
                total += patent.form1200FeeUI.designationFeeUSD;
                if(patent.form1200FeeUI.extensionFeeUSD !== 0) {
                    total += patent.form1200FeeUI.extensionFeeUSD;
                }
                return total;
            }())
            patent.availableFee.officialFeesEUR = (function(){
                var total = 0;
                total += patent.form1200FeeUI.filingFeeEUR;
                total += patent.form1200FeeUI.examinationFeeEUR;
                total += patent.form1200FeeUI.supplementarySearchFeeEUR;
                total += patent.form1200FeeUI.designationFeeEUR;            
                if(patent.form1200FeeUI.extensionFeeEUR !== 0) {
                    total += patent.form1200FeeUI.extensionFeeEUR;
                }
                return total;
            }())
            patent.availableFee.ppFeesUSD = (function(){
                var total = 0;
                total += patent.form1200FeeUI.processingFeeUSD;
                if(patent.form1200FeeUI.expressFeeUSD !== 0) {                 
                    total += patent.form1200FeeUI.expressFeeUSD;
                }
                if(patent.form1200FeeUI.urgentFeeUSD !== 0) {                  
                    total += patent.form1200FeeUI.urgentFeeUSD
                }
                return total;
            }())
            patent.availableFee.ppFeesEUR = (function(){
                var total = 0;
                total += patent.form1200FeeUI.processingFeeEUR;
                if(patent.form1200FeeUI.expressFeeEUR !== 0) {
                    total += patent.form1200FeeUI.expressFeeEUR;
                }
                if(patent.form1200FeeUI.urgentFeeEUR !== 0) {                  
                    total += patent.form1200FeeUI.urgentFeeEUR;
                }
                return total;
            }())  
            
        }        
    }

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