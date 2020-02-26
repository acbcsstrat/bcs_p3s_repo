angular.module('ppApp').controller('validationCtrl', validationCtrl);

validationCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'validationService', '$state', '$timeout', 'activeTabService'];

function validationCtrl(patent, $scope, $rootScope, $uibModal, validationService, $state, $timeout, activeTabService) {

	var vm = this;

	vm.patent = patent;
    vm.checkStates = checkStates;
    vm.submitValidationData = submitValidationData;
    vm.stateSelection = stateSelection;
    vm.templates = [
        { name: 'validationAvailable', url: 'app/templates/validation/validation-available.tpl.htm'},
        { name: 'quotePending', url: 'app/templates/validation/validation-quote-pending.tpl.htm'}
    ];
    $scope.formData = {};
    var validationAction;
    var allState;
    vm.validationInfo = {};

    function stateSelection(selection) {
        $scope.selectionBoolean =  selection == 'De-select all' ? false : true;
        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i] === undefined) { return; }
            allState[i].selected = $scope.selectionBoolean;
        }
    }

    function init() {

    	vm.activeTab = 0;
        console.log('validations ctrl from validaiton ctrl', patent.p3sServicesWithFees[0].serviceStatus.toLowerCase())
		if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available') { //VALIDATION TEST DATA - REMOVE NotUsed
            console.log('validations ctrl should display validations available tab')
    		vm.validationTemplate = vm.templates[0].url;        
            console.log('validations ctrl validaiton template: ', vm.validationTemplate)
    	}

        if(patent.p3sServicesWithFees[0].serviceStatus == 'Preparing Quote') { //VALIDATION TEST DATA - REMOVE NotUsed
            vm.validationTemplate = vm.templates[1].url;        
        }        

    }

    init();

    $scope.$parent.promise
    .then(
        function(){
            $scope.isChecked = true;
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

        }
    )

    function submitValidationData(data){
        console.log('validation ctrl: data', data);
        var formData = {};

        var names = data.corresdpondenceName.split(' ');

        data.designatedStates =  data.designatedStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })  
        data.extensionStates =  data.extensionStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        data.validationStates =  data.validationStates.filter(function(data){
            return data.selected === true;
        }).map(function(filtered){
            delete filtered.selected;
            return filtered;
        })
        console.log('validation ctrl toJson(data.designatedStates:',JSON.parse(angular.toJson(data.designatedStates)));
        console.log('validation ctrl toJson(data.extensionStates):',JSON.parse(angular.toJson(data.extensionStates)));
        console.log('validation ctrl toJson(data.validationState:',JSON.parse(angular.toJson(data.validationStates)));
        // formData.append('patentID', patent.patentID);
        // formData.append('firstName', names[0]);
        // formData.append('lastName', names[1]);
        // formData.append('latestDateToRequestQuote', vm.validationInfo.latestDateToRequestQuote);
        // formData.append('latestDateToPurchaseQuote', vm.validationInfo.latestDateToPurchaseQuote);
        // formData.append('emailaddress', data.corresdpondenceEmailaddress);
        // formData.append('designatedStates', JSON.parse(angular.toJson(data.designatedStates)));
        // formData.append('extensionStates', JSON.parse(angular.toJson(data.extensionStates)));
        // formData.append('validationStates', JSON.parse(angular.toJson(data.validationStates)));

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
                console.log('validation ctrl: requestQuote response', response)
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