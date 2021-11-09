CaseOverviewController.$inject = ['caseSelected', '$scope', '$state', '$stateParams', '$timeout', 'CasesRestService', '$uibModal', 'RenewalHistoryService', 'ActiveTabService', '$mdDialog', 'ngCart']

export default function CaseOverviewController(caseSelected, $scope, $state, $stateParams, $timeout, CasesRestService, $uibModal, RenewalHistoryService, ActiveTabService, $mdDialog, ngCart) {

    var vm = this;

    vm.confirmDeletePatent = confirmDeletePatent;
    vm.closeCaseoverview = closeCaseoverview;
    vm.deletePatent = deletePatent;
    vm.refreshChart = refreshChart;
    vm.patent = caseSelected;
    vm.portfolioLoaded = false;
    vm.setTab = setTab;
    vm.checkAvailableAction = checkAvailableAction;
    vm.processView = processView
    vm.openMenu = openMenu;
    vm.pendingAssisted = null;
    vm.assistedAvailable = null;
    $scope.notInProgress = true;
    $scope.caseoverview_tab = 'details';
    $scope.showOptions = false;
    $scope.activeLeft = 0;
    $scope.renewalHistory = null;
    vm.supportType = ['Intellectual Property', 'Assisted Formality Filing', 'WebApp Technical', 'Other'];

    var chartTimeout;
    var originatorEv;
    vm.openSupportMenu = openSupportMenu;
    vm.selectSupportType = selectSupportType;
    vm.selectMultiFormality = selectMultiFormality;

    var requestObj = {};

    var assistedOkStatuses = ['Epct available', 'Epct saved', 'Epct being generated', 'Grant available', 'Grant saved', 'Validation available', 'Preparing quote', 'Quote provided'];

    function findCommonElements3(arr1, arr2) {
        return arr1.some(item => arr2.includes(item))
    }

    function openSupportMenu($mdMenu, ev) {


        if(caseSelected.p3sServicesWithFees.length > 1) {
            vm.multipleFormalities = true;
            vm.displaySupportTypes = false;

        } else {

            if(!vm.assistedAvailable || vm.pendingAssisted) { //if status is not eligble for assisted formality filing || 

                var index = vm.supportType.indexOf('Assisted Formality Filing');
                if(index > -1) {                
                    vm.supportType.splice(index, 1);
                }
            }

            requestObj.formalityType = caseSelected.p3sServicesWithFees[0].serviceType;
            vm.multipleFormalities = false;
            vm.displaySupportTypes = true;
        }
        originatorEv = ev;
        $mdMenu.open(ev);
    }

    function selectMultiFormality(type) {

        var index = vm.supportType.indexOf('Assisted Formality Filing');
        if(type =='renewal') {
            if(index >= 0) {            
                vm.supportType.splice(index, 1);
            }
        }
        if(type =='grant') {

            var formalityStatus = caseSelected.p3sServicesWithFees.find(function(x){
                return x.serviceType == 'grant';
            }).serviceStatus;

            var mappedStatuses = caseSelected.p3sServicesWithFees.map(function(item){
                return item.serviceStatus;
            })

            vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
                return item.supportRequestedBy !== null;
            })

            vm.assistedAvailable = assistedOkStatuses.some(function(item){
                return item == formalityStatus;
            })

            if(!findCommonElements3(mappedStatuses, assistedOkStatuses) || vm.pendingAssisted) { //if assisted filing isn't available
                var index = vm.supportType.indexOf('Assisted Formality Filing');
                if(index > -1) { 
                    vm.supportType.splice(index, 1);
                }
            }


            if(index < 0 && vm.assistedAvailable) { //if user has previously selected 'renewal', populate array with assisted formality filing
                vm.supportType.push('Assisted Formality Filing')
            }
        }             
        requestObj.formalityType = type;
        vm.multipleFormalities = false;
        vm.displaySupportTypes = true;
    }    

    function confirmRequestForSupport(obj) {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.confirm-requesting-assitance.tpl.htm'),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,
            controller: ['$uibModalInstance', function($uibModalInstance) {

                this.supportType = obj.supportType;
                this.epApplicationNumber = obj.epApplicationNumber;
                
                this.cancel = function () {
                    $uibModalInstance.close();
                };

                this.confirm = function () {
                    $state.go('general-support', {supportObj: obj});
                };                    

            }]

        })
    }

    function selectSupportType(type) {

        requestObj.supportType = type;
        requestObj.epApplicationNumber = caseSelected.ep_ApplicationNumber;
        requestObj.patentID = caseSelected.patentID;            
        if(type !== 'Assisted Formality Filing') {
            confirmRequestForSupport(requestObj)
        } else {
            var modalInstance = $uibModal.open({
                template: require('html-loader!../html/modals/modal.assisted-formality-details.tpl.htm'),
                scope: $scope,
                controllerAs:'$ctrl',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'wide-modal',
                controller: ['$uibModalInstance', function($uibModalInstance) {
                    
                    this.cancel = function () {
                        $uibModalInstance.close(false);
                    };

                    this.confirm = function () {
                        $uibModalInstance.close(true);
                    };

                    this.feeOject = {                           
                        'epctSupportFee': 900,
                        'grantSupportFee': 600,
                        'valAnySupportFee': 550,
                        'valLondonSupportFee': 300
                    }

                }]


            })

            modalInstance.result.then(function(x){
                if(x) {
                    requestObj.supportType = type;
                    confirmRequestForSupport(requestObj)
                }
            })
        }
    }

    function processView(tab, index, chart) {
        if((tab == 'reminders' && $scope.validationNotification) || (tab == 'costchart' && $scope.validationNotification) || (tab == 'fxchart' && $scope.validationNotification)) { return; }
        if(!$scope.notInProgress || tab == 'reminders' || tab == 'details') {
            vm.setTab(tab)
            $scope.activeLeft = index;
            if(chart !== undefined) {
                vm.refreshChart()
            }
        }
    }

    function openMenu($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    function init() {

        if($stateParams.form1200generate === 1) {
            $scope.activeLeft = 2;
            $scope.caseoverview_tab = 'form1200';
            ActiveTabService.setTab(0);
        }

        if($stateParams.prepareGrant === 1) {
            $scope.activeLeft = 4;
            $scope.caseoverview_tab = 'grantandpublishing';
            ActiveTabService.setTab(0);
        }

        if($stateParams.validationQuote === 1) {
            $scope.activeLeft = 8;
            $scope.caseoverview_tab = 'validation';
            ActiveTabService.setTab(0);
        }        

        $scope.promise.then(
            function(){

                $scope.phoneNumber = $scope.ppDetails.partnerPhone;
                vm.portfolioLoaded = true;
                RenewalHistoryService.fetchHistory(caseSelected.patentID) //needs to be invoked outside of availableServices. A service wont be available even if there is renewal history
                .then(
                    function(response){
                        $scope.renewalHistory = response;
                        if(response.length > 0) {
                           vm.displayRenewalHistoryTab = true;
                           return;
                        }
                        vm.displayRenewalHistoryTab = false;
                    }
                )


                $scope.noReminders = caseSelected.p3sServicesWithFees.some(function(item){
                    return item.saleType == 'Not In Progress' && item.serviceStatus == 'NotUsed';
                })
                 
                $scope.notInProgress = caseSelected.p3sServicesWithFees.every(function(item){
                    return (item.saleType == 'Not In Progress' && item.serviceType !== 'validation' && item.serviceStatus !== 'Completed')|| (item.serviceType == 'validation' && (item.serviceStatus == 'Validation available' || item.serviceStatus == 'Preparing quote')) || (item.saleType == 'Offline' && item.serviceType == 'validation');
                })

                $scope.availableServices = caseSelected.p3sServicesWithFees.filter(function(o){
                    return o.saleType !== 'Not In Progress' || (o.saleType == 'Not In Progress' && o.serviceType == 'validation' && o.serviceStatus == 'Completed');
                }).map(function(k, index){
                    if(k.serviceType == 'epct') { k.serviceType = 'Euro-PCT' }
                    return {id: index, action: k.serviceType, status: k.serviceStatus, type: k.saleType, urgent: k.isUrgentAttention}
                })

                $scope.availableServices.forEach(function(obj){
  
                    if(obj.type == 'Not In Progress' && obj.action !== 'validation' && obj.status !== 'Completed') { return; }

                    if(obj.action == 'Euro-PCT') {
                        vm.displayForm1200Tab = true;
                    }

                    if(obj.action == 'grant') {
                        // if(obj.status == 'Grant available' || obj.status == 'Grant saved' || obj.status == 'Manual processing' || obj.status == 'Payment in progress' || obj.status == 'EPO instructed' ) {
                            vm.displayGrantTab = true;
                        // }
                    }

                    if(obj.action == 'validation') {
                        vm.displayValidationTab = true;
                    }
                })

                vm.pendingAssisted = caseSelected.p3sServicesWithFees.some(function(item){
                    return item.supportRequestedBy !== null;
                })
                
                vm.assistedAvailable = caseSelected.p3sServicesWithFees.some(function(item){
                    return assistedOkStatuses.includes(item.serviceStatus)
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

    function confirmDeletePatent(patent) {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.confirm-delete-patent.tpl.htm'),
            appendTo: undefined,
            backdropClass: 'second-backdrop',
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

                this.deletePatent = function() {
                    this.deleteInprogress = true;
                    deletePatent(patent);
                    $timeout(function() {
                        $uibModalInstance.close();
                    }, 300);
                };

                this.cancelDeletion = function() {
                    $uibModalInstance.close();
                };

            }]
        });
    };

    function deletePatent(patent){


        var actionIds = patent.p3sServicesWithFees.map(function(r){
            return r.actionID;
        })

        var cartItems = ngCart.getItems().map(function(r){
            return parseInt(r._id);
        })

        var found = actionIds.find(function(r) {
            return cartItems.indexOf(r) >= 0;
        })      

        if(found) {
            ngCart.removeItemById(found, true)
        }

        

        CasesRestService.deletePatent(patent.patentID)
        .then(
            function(response){
                $state.go('portfolio', {}, {reload: true})
            },
            function(errResponse){
                deletePatentError(errResponse);
            }
        );
    };

    function deletePatentError(errResponse) {

        if(errResponse.status === 304) {
            var modalInstance = $uibModal.open({
                template: require('html-loader!../html/modals/modal.delete-patent-error-trans.tpl.htm'),
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
                template: require('html-loader!../html/modals/modal.delete-patent-error.tpl.htm'),
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