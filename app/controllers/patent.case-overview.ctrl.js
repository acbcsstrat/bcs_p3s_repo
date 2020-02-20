angular.module('ppApp').controller('caseOverviewCtrl', caseOverviewCtrl);

caseOverviewCtrl.$inject = ['patent', '$scope', '$state', '$stateParams', '$timeout', '$location', '$anchorScroll', 'patentsRestService', '$uibModal', 'renewalRestService', 'activeTabService', '$mdDialog']

function caseOverviewCtrl(patent, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, patentsRestService, $uibModal, renewalRestService, activeTabService, $mdDialog) {

    var vm = this;

    vm.confirmDeletePatent = confirmDeletePatent;
    vm.deletePatent = deletePatent;
    vm.refreshChart = refreshChart;
    vm.closeCaseoverview = closeCaseoverview;
    vm.portfolioLoaded = false;
    vm.setTab = setTab;
    vm.checkAvailableAction = checkAvailableAction;
    $scope.availableServices = [];
    $scope.notInProgress = true;
    $scope.caseoverview_tab = 'details';
    $scope.showOptions = false;
    $scope.activeLeft = 0;

    var chartTimeout;
    var originatorEv;

    vm.processView = function(tab, index, chart) {
        if(!$scope.notInProgress) {
            vm.setTab(tab)
            $scope.activeLeft = index;
            if(chart !== undefined) {
                vm.refreshChart()
            }
        }

    }

    vm.openMenu = function($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    function init() {

        if($stateParams.form1200generate === 1) {
            $scope.activeLeft = 2;
            $scope.caseoverview_tab = 'form1200';
            activeTabService.setTab(0);
        }

        if($stateParams.prepareGrant === 1) {
            $scope.activeLeft = 4;
            $scope.caseoverview_tab = 'grantandpublishing';
            activeTabService.setTab(0);
        }

        $scope.$parent.promise.then(
            function(){

                vm.patent = patent;
                vm.portfolioLoaded = true;

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

                $scope.notInProgress = patent.p3sServicesWithFees.every(function(item){
                    return item.saleType == 'Not In Progress';
                })
    
                patent.p3sServicesWithFees.forEach(function(data, index){
                    if(data.serviceType == 'epct') { data.serviceType = 'Euro-PCT' }
                    if(data.saleType !== 'Not In Progress' || data.serviceType == 'postgrant') { //VALIDAITON TEST DATA - REMOVE POSTGRANT
                        $scope.availableServices.push({id: index, action: data.serviceType, status: data.serviceStatus, type: data.saleType})
                    }
                })

                $scope.availableServices.forEach(function(obj){
                    if(obj.action == 'postgrant') {
                        vm.displayValidationTab = true;
                    }
                    if(obj.type == 'Not In Progress') { return; }
                    if(obj.action == 'Euro-PCT') {
                        if(obj.status == 'Epct available' || obj.status == 'Epct rejected' || obj.status == 'Await pdf gen start' || obj.status == 'Epct being generated' || obj.status == 'Epct saved' || obj.status == 'EPO Instructed' || obj.status == 'Payment in progress') {
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
        )

    }

    init()

    function refreshChart (){
        chartTimeout = $timeout(function(){  
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 300)
    }

    function setTab(tab) {
        $scope.caseoverview_tab = tab;
    }

    function closeCaseoverview() {
        $state.go('portfolio', {}, {reload: false})
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

    function checkAvailableAction(services) {
        vm.actionsAvailable = services.some(function(item){
            return item.saleType === 'Online' || item.saleType === 'Offline' || item.saleType === 'In Progress';
        })
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(chartTimeout);
    })


    
}