angular.module('ppApp').controller('patentInfoCtrl', patentInfoCtrl);

patentInfoCtrl.$inject = ['$scope', 'patent', '$rootScope', '$state', '$timeout', '$location', '$anchorScroll', 'fxCalculationService', 'currentTransactionsService', 'patentsRestService', 'chunkDataService', '$uibModal', 'coreService']

function patentInfoCtrl($scope, patent, $rootScope, $state, $timeout, $location, $anchorScroll, fxCalculationService, currentTransactionsService, patentsRestService, chunkDataService, $uibModal, coreService) {

    var vm = this;

    vm.patent = patent;
    vm.directToRenewal = directToRenewal;
    vm.fetchItemTransaction = fetchItemTransaction;
    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.updatePatent = updatePatent;
    vm.editItem = editItem;
    vm.doneEditing = doneEditing;
    vm.editing=[];
    vm.displayNotifications = displayNotifications;

    vm.$onInit = function() {
        if(patent) {
            // fxCalculationService.setFx(patent);
            // vm.patentFx = fxCalculationService;
            coreService.ppContact()
            .then(
                function(response){
                    vm.partnerName = response.partnerName;
                    vm.partnerPhone = response.partnerPhone;
                },
                function(errResponse){

                }
            )
        }
    }

    function directToRenewal() {
        $state.go('portfolio.patent.renewal.info', {}, {reload: false}); //REVISE TO SEE IF MORE EFFICIENT WAY
    };

    function fetchItemTransaction(id) {
        currentTransactionsService.fetchCurrentTransactions()
        .then(
            function(response) {
                response.forEach(function(data) {
                    const transId = data.id;
                    data.renewalUIs.forEach(function(data, i) {
                        if(data.patentUI.id == id) { //compare id submitted from view to all array items id
                            $state.go('current-transactions.current-transaction-item',{transId: transId}) //if match, go current-transaction-item
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
                });
            },
            function(errResponse) {
                console.log(errResponse);
            }
        );
    };

    // function fetchItemTransaction(id) {
    //     currentTransactionsService.fetchCurrentTransactions()
    //     .then(
    //         function(response) {
    //             response.forEach(function(data) {
                    
    //                 var transaction = data.renewalUIs.find(function(data, i) {
    //                     return data.patentUI.id == id;
    //                 })

    //                 if(transaction) {
    //                     $state.go('current-transactions.current-transaction-item',{transId: transaction}) //if match, go current-transaction-item
    //                     .then(
    //                         function(response){
    //                             $timeout(function() {
    //                                 $location.hash('currTransAnchor'); 
    //                                 $anchorScroll();  //scroll to anchor href
    //                             }, 300);
    //                         },
    //                         function(errResponse){
    //                             console.log(errResponse);
    //                         }
    //                     );
    //                 }
    //             });
    //         },
    //         function(errResponse) {
    //             console.log(errResponse);
    //         }
    //     );
    // };    

    function updatePatent(id) {

        patentsRestService.updatePatent(patent, id)
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