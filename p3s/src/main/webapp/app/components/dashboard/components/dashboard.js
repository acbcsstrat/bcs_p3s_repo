app.component('dashboard', {
	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: function($stateParams, $state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http, $rootScope) {

		var vm = this;



		

		vm.$onInit = () => {

			var patents = vm.patents;			

			vm.color = 0;

			vm.greenRenewals = [];
			vm.yellowRenewals = [];
			vm.redRenewals = [];
			vm.blueRenewals = [];
			vm.blackRenewals = [];

			//COLOUR KEY

			vm.colourKey = function(colour) {
				switch(colour) {
					case 0:
						vm.colourPhaseTitle = {
							title: vm.labels[0],
							descrip: 'lorem'
						}
						vm.blueCarousel = true;
					break;
					case 1:
						vm.colourPhaseTitle = {
							title: vm.labels[1],
							descrip: 'loremmm'
						}
						vm.colour = 1;
					break;
					case 2:
						vm.colourPhaseTitle = {
							title: vm.labels[2],
							descrip: 'lorem ipsum'
						}
						vm.colour = 2;
					break;
					case 3:
						vm.colourPhaseTitle = {
							title: vm.labels[3],
							descrip: 'ispum galtoria'
						}
						vm.colour = 3;
					break;
					case 4:
						vm.colourPhaseTitle = {
							title: vm.labels[4],
							descrip: 'herisuhimas'
						}
						vm.colour = 4;
				}
			}




			//TOTAL RENEWALS PIE CHART

			vm.totalPatents = patents.length;

			vm.labels = ["Green", "Yellow", "Red", "Blue", "Black"];

			patents.forEach(function(item){
				switch(item.costBandColour) {
					case 'Green':
						vm.greenRenewals.push(item)
					break;
					case 'Yellow':
						vm.yellowRenewals.push(item)
					break;
					case 'Red':
						vm.redRenewals.push(item)
					break;
					case 'Blue':
						vm.blueRenewals.push(item)
					break;
					case 'Black':
						vm.blackRenewals.push(item)									
				}

				vm.data = [vm.greenRenewals.length, vm.yellowRenewals.length, vm.redRenewals.length, vm.blueRenewals.length, vm.blackRenewals.length];

			})

	   		// $scope.$watch('activeTab', function (active) {
		    // 	if (active !== undefined) {
		    //   		console.log('slide ' + active + ' is active');
		    // 	}		
   	 	// 	}) 



   	 		vm.phaseSliderInfo = function(id) {

   	 			var phaseArr;

   	 			switch(id) {
					case 0:
						phaseArr = vm.greenRenewals;
					break;
					case 1:
						phaseArr = vm.yellowRenewals;
					break;
					case 2:
						phaseArr = vm.redRenewals;
					break;
					case 3:
						phaseArr = vm.blueRenewals;
					break;
					case 4:
						phaseArr = vm.blackRenewals;								
				}

	 			$scope.myInterval = 0;
			  	$scope.noWrapSlides = false;
			  	$scope.active = 0;
			  	var slides = $scope.slides = [];
			  	var currIndex = 0;

		 	 	$scope.addSlide = function() {
		 	 		var length = slides.length % phaseArr.length;
		 	 		// console.log(phaseArr)
				    slides.push({
			      		appNo: phaseArr[length].patentApplicationNumber,
			      		description: phaseArr[length].shortTitle,
			      		dueDate: phaseArr[length].renewalDueDateUI,
			      		id: currIndex++
			    	});
			  	};

			  	for (var i = 0; i < phaseArr.length; i++) {
			    	$scope.addSlide();
			  	}

	  			 
		  	} //phaseSliderInfoEnd

		} //$onInit end	

  		$scope.onSlideChanged = function (nextSlide, direction, currentIndex) {
			    console.log(currentIndex);
		}		
		

	}	
})
.directive('onCarouselChange', function($parse) {
    return {
        require: '^uibCarousel',
        link: function(scope, element, attrs, carouselCtrl) {
            var fn = $parse(attrs.onCarouselChange);
            var origSelect = carouselCtrl.select;
            carouselCtrl.select = function(nextSlide, direction, currentIndex) {
                    fn(scope, {
                        nextSlide: nextSlide,
                        direction: direction,
                        currentIndex: this.getCurrentIndex(this)
                    });
                return origSelect.apply(this, arguments);
            };
        }
    };
});