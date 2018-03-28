function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;

	vm.selectedPhase = selectPhaseService;
	vm.setPhase = setPhase; 

	if(patents) {
		var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases and calculate progress
		vm.setPhase('green');
	}

	function setPhase(phase) {
		$scope.$emit('phaseChange', {phase: phase})
		selectPhaseService.setPhase(phase, sortedPatentData); //set current phase being displayed
	}

}

angular.module('ppApp').controller('colourKeyCtrl', colourKeyCtrl);