angular.module('ppApp').controller('validationCtrl', validationCtrl);

validationCtrl.$inject = ['patent', '$scope', '$rootScope', '$uibModal', 'validationService', '$state', '$timeout', 'activeTabService'];

function validationCtrl(patent, $scope, $rootScope, $uibModal, validationService, $state, $timeout, activeTabService) {

	var vm = this;

	vm.patent = patent;
    vm.templates = [
        { name: 'validationintro.html', url: 'app/templates/validation/validation-available.tpl.htm'}
    ];
    $scope.formData = {};
    $scope.validate = {};
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

}