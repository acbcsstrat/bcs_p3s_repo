angular.module('ppApp').controller('caseOverviewCtrl', caseOverviewCtrl);

caseOverviewCtrl.$inject = ['patent', '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', 'patentsRestService', '$uibModal', 'renewalRestService', 'activeTabService']

function caseOverviewCtrl(patent, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, patentsRestService, $uibModal, renewalRestService, activeTabService) {

    var vm = this;

    vm.patent = patent;

    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.refreshChart = refreshChart;
    $scope.availableServices = [];
    $scope.notInProgress = true;

    var chartTimeout;

    function refreshChart (){
        chartTimeout = $timeout(function(){  
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

        if($stateParams.form1200generate === 1) {
            $scope.activeLeft = 2;
            activeTabService.setTab(0)
        }

        if($stateParams.prepareGrant === 1) {
            $scope.activeLeft = 4;
            activeTabService.setTab(0)
        }

        renewalRestService.fetchHistory(patent.patentID) //needs to be invoked outside of availableServices. A service wont be available even if there is renewal history
        .then(
            function(response){
                if(response.length > 0) {
                   vm.displayRenewalHistoryTab = true;
                   return;
                }
                vm.displayRenewalHistoryTab = false;
            }
        )

        patent.p3sServicesWithFees.forEach(function(data, index){
            $scope.notInProgress = data.saleType == 'Not In Progress' ? true : false;
            $scope.availableServices.push({id: index, action: data.serviceType, status: data.serviceStatus, type: data.saleType})
        })

        $scope.availableServices.forEach(function(obj){

            if(obj.type == 'Not In Progress') { return; }

            if(obj.action == 'epct') {
                if(ob.status == 'Epct available' || obj.status == 'Epct rejected' || obj.status == 'Await pdf gen start' || obj.status == 'Epct being generated' || obj.status == 'Epct saved' || obj.status == 'EPO Instructed' || obj.status == 'Payment in progress') {
                    vm.displayForm1200Tab = true;
                }
                
            }

            if(obj.action == 'grant') {
                if(obj.status == 'Grant available' || obj.status == 'Grant saved' || obj.status == 'Manual processing' || obj.status == 'Payment in progress' || obj.status == 'EPO instructed' ) {
                    vm.displayGrantTab = true;
                }
                
            }

        })
    }

    init()

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
            function(response){
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

    $scope.$on('$destroy', function(){
        $timeout.cancel(chartTimeout);
    })


    
}