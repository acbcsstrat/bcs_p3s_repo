angular.module('ppApp').controller('validationCtrl', validationCtrl);

validationCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'validationService', '$state', '$timeout', 'activeTabService'];

function validationCtrl(patent, $scope, $rootScope, $uibModal, validationService, $state, $timeout, activeTabService) {

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


    vm.poaStates = [
        {
            stateCode: 'UK',
            stateName: 'United Kingdom'

        },
        {
            stateCode: 'BA',
            stateName: 'Bosnia'

        }
    ]

    function init() {

    	vm.activeTab = 0;
        console.log('patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() INIT : ', patent.p3sServicesWithFees[0].serviceStatus.toLowerCase())
		if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('validations ctrl should display validations available tab')
    		vm.validationTemplate = vm.templates[0].url;        
            console.log('validations ctrl validaiton template: ', vm.validationTemplate)
    	}

        console.log('validations ctrl from validaiton ctrl', patent.p3sServicesWithFees[0].serviceStatus)
        if(patent.p3sServicesWithFees[0].serviceStatus == 'Preparing quote') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('it is preparing quote')
            vm.validationTemplate = vm.templates[1].url;        
            console.log('vm.validationTemplate : ', vm.validationTemplate)
        }

        if(patent.p3sServicesWithFees[0].serviceStatus == 'Quote provided') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('it is preparing quote')
            vm.validationTemplate = vm.templates[2].url;        
            console.log('vm.validationTemplate : ', vm.validationTemplate)
        }

        if(patent.p3sServicesWithFees[0].serviceStatus == 'Payment in progress') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('it is preparing quote')
            vm.validationTemplate = vm.templates[3].url;        
            console.log('vm.validationTemplate : ', vm.validationTemplate)
        }        

        if(patent.p3sServicesWithFees[0].serviceStatus == 'Blank PoAs provided') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('PoAs Available')
            vm.validationTemplate = vm.templates[4].url;        
            console.log('vm.validationTemplate : ', vm.validationTemplate)
        }                    

    }

    init();

    $scope.$parent.promise
    .then(
        function(){
            $scope.isChecked = true;

            vm.patent = patent; 
            console.log(vm.patent)

            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') {
                validationService.fetchDesignatedStates(patent.patentID)
                .then(
                    function(response){

                        console.log('validations ctrl response fetching designated state: ', response);
                        vm.validationInfo = response;
                        $scope.formData.corresdpondenceName = response.firstName +' ' + response.lastName;
                        $scope.formData.corresdpondenceEmailaddress = response.emailaddress;
                        $scope.formData.designatedStates = response.designatedStates;
                        $scope.formData.extensionStates = response.extensionStates;
                        $scope.formData.validationStates = response.validationStates;
                        allState = $scope.formData.designatedStates.concat($scope.formData.extensionStates, $scope.formData.validationStates)
                    }
                )
            }


            console.log('patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() promise: ', patent.p3sServicesWithFees[0].serviceStatus.toLowerCase())

            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'preparing quote') { 
                console.log('im in')
                 validationService.fetchPreparedQuote(patent.patentID)
                 .then(
                    function(response){
                        console.log('validation ctrl prepraredQuote response : ', response)
                        vm.preparedQuote = response;
                    }
                )

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

    function submitPoaDocuments(data) {

        console.log(data)

    }

    function submitValidationData(data){
        console.log('validation ctrl: data', data);
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

                console.log('validation ctrl: requestQuote response', response);
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