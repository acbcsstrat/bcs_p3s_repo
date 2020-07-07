ValidationController.$inject = ['caseSelected', '$scope', '$uibModal', '$state', '$timeout', '$q', 'ValidationService'];

export default function ValidationController(caseSelected, $scope, $uibModal, $state, $timeout, $q, ValidationService) {

	var vm = this;

    vm.checkStates = checkStates;
    vm.submitValidationData = submitValidationData;
    vm.stateSelection = stateSelection;
    vm.requestNewQuote = requestNewQuote;
    vm.submitPoaDocuments = submitPoaDocuments;
    vm.patent = '';
    vm.templates = [
        { name: 'validationAvailable', url: require('html-loader!../html/validation/validation-available.tpl.htm')},
        { name: 'quotePending', url: require('html-loader!../html/validation/validation-quote-pending.tpl.htm')},
        { name: 'quoteProvided', url: require('html-loader!../html/validation/validation-quote-provided.tpl.htm')},
        { name: 'paymentInProgress', url: require('html-loader!../html/validation/validation-payment-in-progress.tpl.htm')},
        { name: 'poasProvided', url: require('html-loader!../html/validation/validation-poa-available.tpl.htm')},
        { name: 'noPoasProvided', url: require('html-loader!../html/validation/validation-nopoas-required.tpl.htm')},
        { name: 'workInProgress', url: require('html-loader!../html/validation/validation-wip.tpl.htm')},
        { name: 'manual', url: require('html-loader!../html/validation/validation-available.tpl.htm')},
        { name: 'completed', url: require('html-loader!../html/validation/validation-completed.tpl.htm')}
    ];

    $scope.formData = {};
    var validationAction;
    var allState = [];
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

        $scope.isChecked = true;
        vm.patent = caseSelected; 
        $scope.phoneNumber = $scope.ppDetails.partnerPhone;

        var serviceStatusL = caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase();
        if(caseSelected.p3sServicesWithFees[0].validationFeeUI !== null) {
            var array = [];
            allState = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates)
        }
        vm.activeTab = 0;

        if(serviceStatusL == 'validation available') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[0].url;        
        }
        
        if(serviceStatusL == 'preparing quote' || serviceStatusL == 'quote pending') {
            vm.validationTemplate = vm.templates[1].url;        
        }        

        if(serviceStatusL == 'quote provided') {
            vm.validationTemplate = vm.templates[2].url;        
        }

        if(serviceStatusL == 'payment in progress' || serviceStatusL == 'pa instructed') {
            vm.validationTemplate = vm.templates[3].url;        
        }

        if(serviceStatusL == 'blank poas provided' || serviceStatusL == 'blank poas downloaded') { //VALIDATION TEST DATA - REMOVE NotUsed
            var noPoasNeeded = allState.every(function(item){
                return item.poaNeeded === false;
            })            
            caseSelected.postAddress = caseSelected.validationQuoteUI.poaPostalAddress.split(',');
            vm.validationTemplate = vm.templates[4].url;        
            
        }                    

        if(serviceStatusL == 'scanned poas received' || serviceStatusL == 'poas provided to pa' || serviceStatusL == 'paper documents received') { //VALIDATION TEST DATA - REMOVE NotUsed
            
            var noPoasNeeded = allState.every(function(item){
                return item.poaNeeded === false;
            })                   
            if(noPoasNeeded) {
                vm.validationTemplate = vm.templates[5].url;  
            } else {
                vm.validationTemplate = vm.templates[6].url;
            }
        }

        if(serviceStatusL == 'completed') {
            vm.validationTemplate = vm.templates[8].url;
            var array = [];
            vm.statesCompleted = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates);
        }

        if(caseSelected.p3sServicesWithFees[0].saleType.toLowerCase() == 'offline') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[7].url;  
        }

        if(caseSelected.p3sServicesWithFees[0].validationFeeUI !== null) {
            var array = [];
            allState = array.concat(caseSelected.p3sServicesWithFees[0].validationFeeUI.designatedStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.extensionStates, caseSelected.p3sServicesWithFees[0].validationFeeUI.validationStates)
        }

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') {
            ValidationService.fetchDesignatedStates(caseSelected.patentID)
            .then(
                function(response){
                    vm.validationInfo = response;
                    $scope.formData.corresdpondenceName = response.firstName +' ' + response.lastName;
                    $scope.formData.corresdpondenceEmailaddress = response.emailaddress;
                    $scope.formData.designatedStates = response.designatedStates;
                    $scope.formData.extensionStates = response.extensionStates;
                    $scope.formData.validationStates = response.validationStates;
                    var array = [];
                    allState = array.concat($scope.formData.designatedStates, $scope.formData.extensionStates, $scope.formData.validationStates);
                }
            )
        }

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'preparing quote') { 
            ValidationService.fetchPreparedQuote(caseSelected.patentID)
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

        if(caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'blank poas provided' || caseSelected.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'blank poas downloaded') {
            $scope.formData.designatedStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.designatedStates;
            $scope.formData.extensionStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.extensionStates;
            $scope.formData.validationStates = vm.patent.p3sServicesWithFees[0].validationFeeUI.validationStates;   

        }

    }

    init()

    function requestNewQuote() {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.validation-confirm-deletion.tpl.htm'),
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.confirmDeletion = function() {
                    $uibModalInstance.close();
                    ValidationService.deleteQuote(caseSelected.patentID)
                    .then(
                        function(response){
                            $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
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
            promiseArray.push(ValidationService.submitPoas(caseSelected.patentID, allStatesMapped[i]))
        }

        $q.all(promiseArray)
        .then(
            function(response){
                ValidationService.poaUploadSuccessNotify(caseSelected.patentID)
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.validation-poas-submitted.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse){

                ValidationService.poaUploadFailNotify(caseSelected.patentID)
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.validation-poas-submitted-error.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
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

        formData.patentID = caseSelected.patentID;
        
        formData.lastName = names.pop();
        formData.firstName = names.toString().replace(/,/g, ' ');

        formData.latestDateToRequestQuote = vm.validationInfo.latestDateToRequestQuote;
        formData.latestDateToPurchaseQuote = vm.validationInfo.latestDateToPurchaseQuote;
        formData.emailaddress = data.corresdpondenceEmailaddress;
        formData.designatedStates = JSON.parse(angular.toJson(data.designatedStates));
        formData.extensionStates = JSON.parse(angular.toJson(data.extensionStates));
        formData.validationStates = JSON.parse(angular.toJson(data.validationStates));

        ValidationService.requestQuote(formData)
        .then(
            function(response){

                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.validation-quote-requested.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID, prepareGrant: 0, form1200generate: 0, validationQuote: 1}, {reload: true})
            },
            function(errResponse) {
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.validation-quote-failed.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                        this.dismissModal = function() {
                            $uibModalInstance.close();
                        };

                    }]
                });

                $state.go('portfolio.modal.case', {caseId: caseSelected.patentID}, {reload: true})

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