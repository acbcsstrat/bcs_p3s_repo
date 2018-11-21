angular.module('ppApp').controller('colourKeyCtrl', colourKeyCtrl);

colourKeyCtrl.$inject = ['$scope', '$timeout', 'patents', 'patentPhasesService', 'selectPhaseService'];

function colourKeyCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;

	vm.selectedPhase = selectPhaseService;
	vm.setPhase = setPhase;
	

 	$scope.$on('updatePhase', function(e, o){
 		$timeout(function(){
	    	$scope.activeTab = selectPhaseService.getPhase().phase.index;
 		})
  	});
 	// console.log(patents.length)
	if(patents.length > 0) {
		var sortedPatentData = patentPhasesService.phases(patents); //sorts patents into phases and calculate progress
		vm.setPhase('green');
	}

	function setPhase(phase) {

		console.log(phase, sortedPatentData)
		selectPhaseService.setPhase(phase, sortedPatentData); //set current phase being displayed
		$scope.$emit('phaseChange', {phase: phase});		
	}

}