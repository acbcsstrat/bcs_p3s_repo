angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', '$window', 'patentIds', 'patentPhasesService', 'dashboardService', 'organiseColourService', 'organiseTextService']

function renewalsCarouselCtrl($scope, $timeout, $window, patentIds, patentPhasesService, dashboardService, organiseColourService, organiseTextService) {

	var vm = this;

	vm.phaseLoaded = true;
	vm.setPatents = setPatents;
    $timeout(function() {
        vm.patents = patentPhasesService.getPatents;    
    });

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

                $timeout(function() {
                    vm.patentData = patentPhasesService.patentNumbers;
                    vm.currentIndex = currentSlide;
                    vm.currIndexForTitle = (currentSlide + 1);                    
                    vm.patents = patentPhasesService.getPatents;
                    vm.selectedPatent = patentPhasesService.getPatent;
                    if(vm.selectedPatent !== '' && patentPhasesService.getPatents !== '') {
                        patentPhasesService.setPatent(vm.patents[vm.currentIndex])
                        $scope.$emit('updatePatent');
                    }
                }, 200)

            },
            init: function (event, slick, currentSlide) {
                $timeout(function() {
                    angular.element($window.dispatchEvent(new Event("resize")));
                    slick.refresh()      
                  	slick.slickGoTo(vm.currentIndex); // slide to correct index when init
                }, 100);
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