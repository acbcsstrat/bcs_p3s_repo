function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;

	vm.setPhase = function(phase) {
		$scope.$emit('phaseChange', {phase: phase})
		selectPhaseService.setPhase(phase, sortedPatentData); //set current phase being displayed
	}

	if(patents) {
		var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases and calculate progress
		vm.setPhase('green');
	}

	vm.selectedPhase = selectPhaseService;

}

angular.module('ppApp').controller('colourKeyCtrl', colourKeyCtrl);