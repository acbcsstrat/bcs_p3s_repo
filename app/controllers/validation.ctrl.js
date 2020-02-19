angular.module('ppApp').controller('validationCtrl', validationCtrl);

validationCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'validationService', '$state', '$timeout', 'activeTabService'];

function validationCtrl(patent, $scope, $rootScope, $uibModal, validationService, $state, $timeout, activeTabService) {

	var vm = this;

	vm.patent = patent;
    vm.checkStates = checkStates;
    vm.submitValidationData = submitValidationData;
    vm.templates = [
        { name: 'validationintro.html', url: 'app/templates/validation/validation-available.tpl.htm'}
    ];
    $scope.formData = {};
    var validationAction;

    function init() {

    	vm.activeTab = 0;

		if(patent.p3sServicesWithFees[0].serviceStatus == 'NotUsed') { //VALIDATION TEST DATA - REMOVE NotUsed
			vm.validationStage = 1;
    		vm.validationTemplate = vm.templates[0].url;        
    	}

		if(patent.p3sServicesWithFees[0].serviceStatus == 'validation saved') {
			vm.validationStage = 2;
    		vm.validationTemplate = vm.templates[2].url;
    	}
    }

    init();

    $scope.$parent.promise
    .then(
        function(response){

            $scope.isChecked = true;

            validationService.fetchDesignatedStates()
            .then(
                function(response){
                    vm.validationInfo = response;
                    $scope.formData.corresdpondenceName = response.firstName +' ' + response.lastName;
                    $scope.formData.corresdpondenceEmailaddress = response.emailaddress;
                    $scope.formData.designatedStates = response.designatedStates;
                    $scope.formData.extensionStates = response.extensionStates;
                    $scope.formData.validationStates = response.validationStates;
                }
            )

        }
    )

    function submitValidationData(data){    

        var formData = new FormData();
        var config = { headers: {'Content-Type': undefined} };

    }

    function checkStates(item, index, type) {

        var validateType = type+ 'States';

        if(item === true) {
            $scope.formData[validateType][index].selected = true;
        } else {
            $scope.formData[validateType][index].selected = false;
        }  

        var allState = $scope.formData.designatedStates.concat($scope.formData.extensionStates, $scope.formData.validationStates)

        for(var i = 0; 0 < allState.length; i++ ) {
            if(allState[i].selected === true) {
                $scope.isChecked = true;
                break;
            }
            $scope.isChecked = false;
        }

    }

}