function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;

	var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases

	vm.setPhase = function(phase) {
		$scope.$emit('phaseChange', {phase: phase})
		selectPhaseService.setPhase(phase, sortedPatentData);
	}

	vm.setPhase('green');

	vm.selectedPhase = selectPhaseService;

}

app.controller('colourKeyCtrl', colourKeyCtrl);