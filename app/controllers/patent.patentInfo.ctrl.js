angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);

patentInfoCtrl.$inject = ['$scope', 'patent', '$state', '$timeout', '$location', '$anchorScroll', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService', 'organiseTextService']

function patentInfoCtrl($scope, patent, $state, $timeout, $location, $anchorScroll, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService, organiseTextService) {

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

    console.log(patent)


    function getStatus(text) {
        return organiseTextService.uiStatus(text);
    }

    vm.$onInit = function() {
        
        if(patent.renewalFeeUI === null && patent.form1200FeeUI === null) {
            patent.availableFee = null;
            return;
        }

        patent.portfolioUI.serviceList.forEach(function(el){
            if(organiseTextService.actionStatus(el.serviceStatus)) {
                vm.statusesAvailable.push(el.serviceStatus)
            }
        })
        
        patent.availableFee = {};
        patent.availableFee.costBandEndDateUI = patent.portfolioUI.serviceList[0].costBandEndDateUI;
 
        if(patent.renewalFeeUI !== null) {
            patent.availableFee.savings = (function(){
                return patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD;
            }())
            patent.availableFee.title = 'Regional Renewal';
            patent.availableFee.fee = patent.renewalFeeUI;
            patent.availableFee.costHistoryUI = patent.renewalFeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.renewalFeeUI.fxRate;
    
        }

        if(patent.form1200FeeUI !== null) {
            patent.availableFee.savings = (function(){
                return patent.portfolioUI.serviceList[0].nextStageCostUSD - patent.portfolioUI.serviceList[0].currentStageCostUSD;
            }())
            patent.availableFee.title = 'Form 1200';
            patent.availableFee.fee = patent.form1200FeeUI;
            patent.availableFee.costHistoryUI = patent.form1200FeeUI.costHistoryUI;
            patent.availableFee.fxRate = patent.form1200FeeUI.fxRate;
            
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