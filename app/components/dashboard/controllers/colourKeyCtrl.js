function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;
	
	var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases and calculate progress

	vm.setPhase = function(phase) {
		$scope.$emit('phaseChange', {phase: phase})
		selectPhaseService.setPhase(phase, sortedPatentData); //set current phase being displayed
	}

	vm.setPhase('green');

	vm.selectedPhase = selectPhaseService;

}

app.controller('colourKeyCtrl', colourKeyCtrl);