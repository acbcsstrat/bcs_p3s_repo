angular.module('ppApp').controller('validationCtrl', validationCtrl);

validationCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'validationService', '$state', '$timeout', 'activeTabService', 'Upload', '$q'];

function validationCtrl(patent, $scope, $rootScope, $uibModal, validationService, $state, $timeout, activeTabService, Upload, $q) {

	var vm = this;

    vm.checkStates = checkStates;
    vm.submitValidationData = submitValidationData;
    vm.stateSelection = stateSelection;
    vm.requestNewQuote = requestNewQuote;
    vm.submitPoaDocuments = submitPoaDocuments;
    vm.patent = '';
    vm.templates = [
        { name: 'validationAvailable', url: 'app/templates/validation/validation-available.tpl.htm'},
        { name: 'quotePending', url: 'app/templates/validation/validation-quote-pending.tpl.htm'},
        { name: 'quoteProvided', url: 'app/templates/validation/validation-quote-provided.tpl.htm'},
        { name: 'quoteProvided', url: 'app/templates/validation/validation-payment-in-progress.tpl.htm'},
        { name: 'poasProvided', url: 'app/templates/validation/validation-poa-available.tpl.htm'},
        { name: 'noPoasProvided', url: 'app/templates/validation/validation-nopoas-required.tpl.htm'},
        { name: 'workInProgress', url: 'app/templates/validation/validation-wip.tpl.htm'},
    ];
    $scope.formData = {};
    var validationAction;
    var allState;
    vm.validationInfo = {};
    vm.domain = ppdomain;

    function stateSelection(selection) {
        $scope.selectionBoolean =  selection == 'De-select all' ? false : true;
        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i] === undefined) { return; }
            allState[i].selected = $scope.selectionBoolean;
        }
    }

    function init() {
        var serviceStatusL = patent.p3sServicesWithFees[0].serviceStatus.toLowerCase();

        if(patent.p3sServicesWithFees[0].validationFeeUI !== null) {
            allState = patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.concat(patent.p3sServicesWithFees[0].validationFeeUI.extensionStates, patent.p3sServicesWithFees[0].validationFeeUI.validationStates)
        }
    	vm.activeTab = 0;
		if(serviceStatusL == 'validation available') { //VALIDATION TEST DATA - REMOVE NotUsed
    		vm.validationTemplate = vm.templates[0].url;        
    	}

        if(serviceStatusL == 'preparing quote') {
            vm.validationTemplate = vm.templates[1].url;        
        }

        if(serviceStatusL == 'quote provided') {
            vm.validationTemplate = vm.templates[2].url;        
        }

        if(serviceStatusL == 'payment in progress') {
            vm.validationTemplate = vm.templates[3].url;        
        }        

        if(serviceStatusL == 'blank poas provided' || serviceStatusL == 'blank poas downloaded') { //VALIDATION TEST DATA - REMOVE NotUsed

            var noPoasNeeded = allState.every(function(item){
                return item.poaNeeded === false;
            })            
            if(noPoasNeeded) {
                vm.validationTemplate = vm.templates[5].url;  
            } else {
                vm.validationTemplate = vm.templates[4].url;        
            }
        }                    

        if(serviceStatusL == 'scanned poas received' || serviceStatusL == 'poas provided to pa') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[6].url;  
        }           

    }

    init();

    $scope.$parent.promise
    .then(
        function(){
            $scope.isChecked = true;
            vm.patent = patent; 

            if(patent.p3sServicesWithFees[0].validationFeeUI !== null) {
                allState = patent.p3sServicesWithFees[0].validationFeeUI.designatedStates.concat(patent.p3sServicesWithFees[0].validationFeeUI.extensionStates, patent.p3sServicesWithFees[0].validationFeeUI.validationStates)
            }
            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') {
                validationService.fetchDesignatedStates(patent.patentID)
                .then(
                    function(response){
                        vm.validationInfo = response;
                        $scope.formData.corresdpondenceName = response.firstName +' ' + response.lastName;
                        $scope.formData.corresdpondenceEmailaddress = response.emailaddress;
                        $scope.formData.designatedStates = response.designatedStates;
                        $scope.formData.extensionStates = response.extensionStates;
                        $scope.formData.validationStates = response.validationStates;
                        allState = $scope.formData.designatedStates.concat($scope.formData.extensionStates, $scope.formData.validationStates);
                    }
                )
            }

            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'preparing quote') { 
                console.log('im in')
                validationService.fetchPreparedQuote(patent.patentID)
                .then(
                    function(response){
                        vm.preparedQuote = response;
                    }
                )

            }

            function addSignedPoaDoc(item) {
                item.signedPoaDoc = '';
                return item;
            }

            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'blank poas provided') {
                $scope.formData.designatedStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates;
                $scope.formData.extensionStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates;
                $scope.formData.validationStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.validationStates;   

            }

        }
    )

    function requestNewQuote() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.validation-confirm-deletion.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.confirmDeletion = function() {
                    $uibModalInstance.close();
                    validationService.deleteQuote(vm.patent.patentID)
                    .then(
                        function(response){
                            $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
                        }
                    )
                }

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]
        });

    }

    function removeCost(item) {
        delete item.validationCost_EUR;
        delete item.validationCost_USD;
        if(!item.signedPoaDoc) { item.signedPoaDoc = null; };
        return item;
    }

    function submitPoaDocuments(data) {

        var formData = {};

        var designatedMap = data.designatedStates.map(removeCost);
        var extensionMap = data.extensionStates.map(removeCost);
        var validationMap = data.validationStates.map(removeCost);
        var allStatesMapped = designatedMap.concat(extensionMap, validationMap)

        allStatesMapped = allStatesMapped.filter(function(item){
            if(item.signedPoaDoc == null) { return false; }
            return true;
        })
        .map(function(item){
            var newObj = {};
            newObj.stateCode = item.stateCode;
            newObj.signedPoaDoc = item.signedPoaDoc;
            return newObj;
        })

        var promiseArray = [];

        for(var i = 0; i < allStatesMapped.length; i++) {
            promiseArray.push(validationService.submitPoas(patent.patentID, allStatesMapped[i]))
        }

        $q.all(promiseArray)
        .then(
            function(response){

                validationService.poaUploadSuccessNotify(patent.patentID)

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.validation-poas-submitted.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse){

                validationService.poaUploadFailNotify(patent.patentID)

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.validation-poas-submitted-error.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            }
        )

    }

    function submitValidationData(data){

        var formData = {};

        var names = data.corresdpondenceName.split(' ');

        data.designatedStates = data.designatedStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        data.extensionStates = data.extensionStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        data.validationStates = data.validationStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })

        formData.patentID = patent.patentID;
        formData.firstName = names[0];
        formData.lastName = names[1];
        formData.latestDateToRequestQuote = vm.validationInfo.latestDateToRequestQuote;
        formData.latestDateToPurchaseQuote = vm.validationInfo.latestDateToPurchaseQuote;
        formData.emailaddress = data.corresdpondenceEmailaddress;
        formData.designatedStates = JSON.parse(angular.toJson(data.designatedStates));
        formData.extensionStates = JSON.parse(angular.toJson(data.extensionStates));
        formData.validationStates = JSON.parse(angular.toJson(data.validationStates));

        validationService.requestQuote(formData)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.validation-quote-requested.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/templates/modals/modal.validation-quote-failed.tpl.htm',
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.patent', {patentId: patent.patentID}, {reload: true})

            }
        )

    }

    function checkStates(item, index, type) {

        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i] === undefined) { break; }
            if(allState[i].selected === true) {
                $scope.isChecked = true;
                break;
            }
            $scope.isChecked = false;
        }

        if(type === undefined) { return };

        var validateType = type+ 'States';

        if(item === true) {
            $scope.formData[validateType][index].selected = true;
        } else {
            $scope.formData[validateType][index].selected = false;
        } 


    }

}