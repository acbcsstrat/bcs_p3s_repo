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
    $scope.notInProgress = true;
    $scope.validationNotification = false;
    $scope.caseoverview_tab = 'details';
    $scope.showOptions = false;
    $scope.activeLeft = 0;

    var chartTimeout;
    var originatorEv;

    vm.processView = function(tab, index, chart) {
        console.log(tab, index, chart)
        if((tab == 'notifications' && $scope.validationNotification) || (tab == 'costchart' && $scope.validationNotification)) { return; }
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

        if($stateParams.validationQuote === 1) {
            $scope.activeLeft = 8;
            $scope.caseoverview_tab = 'validation';
            activeTabService.setTab(0);
        }        

        $scope.$parent.promise.then(
            function(){

                vm.patent = patent;
                vm.portfolioLoaded = true;
                console.log('caseoverview : ', vm.patent)
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

                $scope.validationNotification = patent.p3sServicesWithFees.some(function(item){
                    return item.serviceType == 'validation';
                })

                $scope.notInProgress = patent.p3sServicesWithFees.every(function(item){
                    console.log('item : ',item)
                    return item.saleType == 'Not In Progress' || (item.serviceType == 'validation' && item.serviceStatus !== 'Quote provided');
                })

                $scope.availableServices = patent.p3sServicesWithFees.map(function(data, index){
                    console.log('caseoverview ctrl: availableServices data : ', data)
                    if(data.serviceType == 'epct') { data.serviceType = 'Euro-PCT' }
                    if(data.saleType !== 'Not In Progress') { //VALIDAITON TEST DATA - REMOVE POSTGRANT
                         console.log('caseoverview ctrl: returning new object to availableServices')
                       return {id: index, action: data.serviceType, status: data.serviceStatus, type: data.saleType}
                    }
                })
                console.log('$scope.availableServices : ', $scope.availableServices)
                $scope.availableServices.forEach(function(obj){

                    console.log('hello caseoverview ctrl: looping through obj: ', obj)

                    if(obj.action == 'validation') {
                        console.log('HELLO caseoverview ctrl: should display validation tab')
                        vm.displayValidationTab = true;
                        console.log('HELLO caseoverview ctrl displayValidationTab: ', vm.displayValidationTab)
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
            return item.saleType === 'Online' || item.saleType === 'Offline' || (item.saleType === 'In Progress' && item.serviceStatus !== 'Preparing quote');
        })
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(chartTimeout);
    })


    
}