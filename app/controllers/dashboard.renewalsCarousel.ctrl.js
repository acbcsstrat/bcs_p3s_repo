angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', 'patents', 'patentPhasesService', 'selectPhaseService', 'fxCalculationService']

function renewalsCarouselCtrl($scope, $timeout, patents, patentPhasesService, selectPhaseService, fxCalculationService) {

	var vm = this;

	vm.phaseLoaded = true;
	vm.sortedPatentData = patentPhasesService.phases(patents);
	vm.setPhase = setPhase;
	vm.selectedPhase = selectPhaseService;
    vm.date = new Date();

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
        		vm.selectedPatent = vm.selectedPhase.getPhase().patents[vm.currentIndex];
        		
        		if(vm.selectedPatent) {
        			if(vm.selectedPatent.feeUI) {
						fxCalculationService.setFx(vm.selectedPatent)
        			}
        		}
        	},
        	init: function (event, slick) {
              	slick.slickGoTo(vm.currentIndex); // slide to correct index when init
            }
        }
    } //slick end

	$scope.$on('updatePhase', function(e, o){
		setPhaseFn(o.phase)
	})

	function setPhase(phase) {
		$scope.$emit('phaseChange', {phase: phase})
		setPhaseFn(phase)
	}    

	function setPhaseFn(phase) {
		vm.phaseLoaded = false;
		selectPhaseService.setPhase(phase, vm.sortedPatentData);
		$timeout(function() {
			vm.phaseLoaded = true;
		}, 10);
	}    

	//renewal cost logic has to be included to accomodate for responsive design 
	///////////////////////////////////////////////////////////////////////////
}