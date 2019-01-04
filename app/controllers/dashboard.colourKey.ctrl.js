angular.module('ppApp').controller('colourKeyCtrl', colourKeyCtrl);

colourKeyCtrl.$inject = ['$scope', '$timeout', 'patents', 'patentPhasesService', 'selectPhaseService', 'organiseColourService'];

function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService, organiseColourService) {

	var vm = this;

	vm.selectedPhase = selectPhaseService;
	vm.setPhase = setPhase;
	vm.getCurrColour = getCurrColour;

	function getCurrColour(phase, type) {
		return organiseColourService.getCurrColour(phase, type);
	}

 	$scope.$on('updatePhase', function(e, o){
 		$timeout(function(){
	    	$scope.activeTab = selectPhaseService.getPhase().index;
 		})
  	});

	if(patents.length > 0) {
		var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases and calculate progress
		vm.setPhase('green');
	}

	function setPhase(phase) {
		selectPhaseService.setPhase(phase, sortedPatentData); //set current phase being displayed
		$scope.$emit('phaseChange', {phase: phase});		
	}

}