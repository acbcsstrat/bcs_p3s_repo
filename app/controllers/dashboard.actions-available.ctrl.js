angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', '$window', 'patentIds', 'patentPhasesService', 'dashboardService', 'organiseColourService', 'organiseTextService']

function renewalsCarouselCtrl($scope, $timeout, $window, patentIds, patentPhasesService, dashboardService, organiseColourService, organiseTextService) {

	var vm = this;

	vm.phaseLoaded = true;
	vm.setPatents = setPatents;
    $timeout(function() {
        vm.patents = patentPhasesService.getPatents;
        vm.patents.map(function(item, i){
            if(item.serviceList.length > 0) {
              item.cssCurrent = organiseColourService.getCurrColour(item.serviceList[0].currentStageColour, 'text')
              item.cssNext = organiseColourService.getCurrColour(item.serviceList[0].nextStageColour, 'text')
            }
        })
        vm.patentData = patentPhasesService.patentNumbers; 
    });

    vm.date = new Date();
    vm.fetchCost = fetchCost;

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