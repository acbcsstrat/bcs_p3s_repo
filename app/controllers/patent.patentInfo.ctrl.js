angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);

patentInfoCtrl.$inject = ['$scope', 'patent', '$state', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService']

function patentInfoCtrl($scope, patent, $state, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService) {

    var vm = this;

    vm.patent = patent;
    vm.dirFeeBreakdown = dirFeeBreakdown;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.updatePatent = updatePatent;
    vm.editItem = editItem;
    vm.doneEditing = doneEditing;
    // vm.currentStatus = currentStatus;
    vm.editing=[];
    vm.statusesAvailable = [];
    
    if(organiseTextService.actionStatus(patent.epctStatus)) {
        vm.statusesAvailable.push(organiseTextService.uiStatus(patent.epctStatus))
    }
    if(organiseTextService.actionStatus(patent.renewalStatus)) {
        vm.statusesAvailable.push(organiseTextService.uiStatus(patent.renewalStatus))
    }
    console.log(vm.statusesAvailable)
    vm.$onInit = function() {
        if(patent.renewalFeeUI !== null) {
            var renewFee = patent.renewalFeeUI;
            renewFee.officialFeesUSD = (function(){
                var total = 0;
                total += renewFee.renewalFeeUSD;
                if(renewFee.extensionFeeUSD !== null) {
                    total += renewFee.extensionFeeUSD;
                }
                return total;
            }())
            renewFee.officialFeesEUR = (function(){
                var total = 0;
                total += renewFee.renewalFeeEUR;
                if(renewFee.extensionFeeEUR !== null) {
                    total += renewFee.extensionFeeEUR;
                }
                return total;
            }())
            renewFee.ppFeesUSD = (function(){
                var total = 0;
                total += renewFee.processingFeeUSD;
                if(renewFee.expressFeeUSD !== null) {
                    total += renewFee.expressFeeUSD;
                }
                if(renewFee.latePayPenaltyUSD !== null) {
                    total += renewFee.latePayPenaltyUSD;
                }
                if(renewFee.urgentFeeUSD !== null) {
                    total += renewFee.urgentFeeUSD
                }
                return total;
            }())
            renewFee.ppFeesEUR = (function(){
                var total = 0;
                total += renewFee.processingFeeEUR;
                if(renewFee.expressFeeEUR !== null) {
                    total += renewFee.expressFeeEUR;
                }
                if(renewFee.latePayPenaltyEUR !== null) {
                    total += renewFee.latePayPenaltyEUR;
                }
                if(renewFee.urgentFeeEUR) {
                    total += renewFee.urgentFeeEUR
                }
                return total;
            }())            
            
        }
    }

    function dirFeeBreakdown() {
        $state.go('portfolio.patent.renewal.info', {}, {reload: false}); //REVISE TO SEE IF MORE EFFICIENT WAY
    };

    function fetchItemTransaction(id) {
        currentTransactionsService.fetchCurrentTransactions()
        .then(
            function(response) {
                response.forEach(function(data) {
                    
                    var transaction = data.renewalUIs.find(function(data, i) {
                        return data.patentUI.id == id;
                    })

                    if(transaction) {
                        $state.go('current-transactions.current-transaction-item',{transId: transaction}) //if match, go current-transaction-item
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
                });
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
                $state.go('patents', {}, {reload: true})
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