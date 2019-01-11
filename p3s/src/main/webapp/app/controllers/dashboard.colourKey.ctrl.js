angular.module('ppApp').controller('colourKeyCtrl', colourKeyCtrl);

colourKeyCtrl.$inject = ['$scope', '$timeout', 'patentIds', 'patentPhasesService', 'organiseColourService'];

function colourKeyCtrl($scope, $timeout, patentIds, patentPhasesService, organiseColourService) {

	var vm = this;

	vm.setPatents = setPatents;
	vm.getCurrColour = getCurrColour;

	function getCurrColour(phase, type) {
		return organiseColourService.getCurrColour(phase, type);
	}

 	$scope.$on('updatePhase', function(e, o){
 		$timeout(function(){
	    	$scope.activeTab = patentPhasesService.getIndex;
 		})
  	});

	function setPatents(phase) {
        patentPhasesService.setPatents(phase);
        $scope.$emit('phaseChange', {phase: phase})	
	}

}