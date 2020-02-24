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
		if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available' || patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'notused') { //VALIDATION TEST DATA - REMOVE NotUsed
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
            if(patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'validation available' || patent.p3sServicesWithFees[0].serviceStatus.toLowerCase() == 'notused') {
                validationService.fetchDesignatedStates(patent.patentID)
                .then(
                    function(response){
                        console.log('validations ctrl response fetching designated state: ', response)
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
        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };
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