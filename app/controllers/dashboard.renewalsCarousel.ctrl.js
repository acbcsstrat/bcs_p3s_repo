angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', 'patentIds', 'patentPhasesService', 'dashboardService', 'organiseColourService', 'organiseTextService']

function renewalsCarouselCtrl($scope, $timeout, patentIds, patentPhasesService, dashboardService, organiseColourService, organiseTextService) {

	var vm = this;

	vm.phaseLoaded = true;
	vm.patentData = patentPhasesService.patentNumbers;
	vm.setPatents = setPatents;
    $timeout(function() {
        vm.patents = patentPhasesService.getPatents;
    }, 300);
    vm.patentsTotal = patentPhasesService.patentNumbers;
    vm.date = new Date();
    vm.getCurrColour = getCurrColour;
    vm.getNextColour = getNextColour;

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

	vm.currentIndex = 0;
    vm.slickConfig = {
    	accessibility: false,
    	arrows: true,
	    enabled: true,
	    autoplay: false,
	    draggable: false,
	    autoplaySpeed: 3000,
	    method: {},
	    event: {
	    	afterChange: function (event, slick, currentSlide, nextSlide) {

	    		vm.currentIndex = currentSlide;
        		vm.currIndexForTitle = (currentSlide + 1);
                $timeout(function(){
                    vm.selectedPatent = patentPhasesService.getPatent;
                }, 500)
        		
        		if(vm.selectedPatent !== null && patentPhasesService.getPatents !== null) {
					patentPhasesService.setPatent(vm.patents[vm.currentIndex])
                    $scope.$emit('updatePatent');
        		}

        	},
        	init: function (event, slick) {
              	slick.slickGoTo(vm.currentIndex); // slide to correct index when init
            }
        }
    } //slick end

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