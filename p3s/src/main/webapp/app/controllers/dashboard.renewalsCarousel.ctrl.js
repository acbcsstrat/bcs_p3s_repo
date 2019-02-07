angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', '$window', 'patentIds', 'patentPhasesService', 'dashboardService', 'organiseColourService', 'organiseTextService']

function renewalsCarouselCtrl($scope, $timeout, $window, patentIds, patentPhasesService, dashboardService, organiseColourService, organiseTextService) {

	var vm = this;

	vm.phaseLoaded = true;
	vm.setPatents = setPatents;
    $timeout(function() {
        vm.patents = patentPhasesService.getPatents;
        vm.patentData = patentPhasesService.patentNumbers; 
    });

    vm.date = new Date();
    vm.getCurrColour = getCurrColour;
    vm.getNextColour = getNextColour;
    vm.fetchCost = fetchCost;

    vm.getStatus = getStatus;

    function getStatus(text) {
        return organiseTextService.uiStatus(text)
    }

    function getCurrColour(phase, type) {
        return organiseColourService.getCurrColour(phase, type)
    }

    function getNextColour(phase, type) {
        return organiseColourService.getNextColour(phase, type)
    }

    function fetchCost(patent) {             
        vm.patents = patentPhasesService.getPatents;
        if(patentPhasesService.getPatent !== '' && patentPhasesService.getPatents !== '') {
            patentPhasesService.setPatent(patent)
            $scope.$emit('updatePatent');
        }        
    }

    $scope.$on('updatePhase', function(e, o){
        setPhaseFn(o.phase)
        $scope.activeTab = patentPhasesService.getIndex;
	})

    function setPatents(phase) {
        patentPhasesService.setPatents(phase);
        setPhaseFn(phase)
        $scope.$emit('phaseChange', {phase: phase})
    }

	function setPhaseFn(phase) {
		vm.phaseLoaded = false;
		$timeout(function() {
            vm.patents = patentPhasesService.getPatents;
            vm.selectedPatent = patentPhasesService.getPatent;
			vm.phaseLoaded = true;
		}, 10);

	}

}