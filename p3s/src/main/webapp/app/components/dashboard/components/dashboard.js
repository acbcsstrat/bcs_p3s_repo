app.component('dashboard', {
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: ['dashboardService', 'patentsService', function(dashboardService, patentsService) {

		var vm = this;

		vm.colourPhase = {
			green: 'green',
			yellow: 'yellow',
			red: 'red',
			blue: 'blue',
			black: 'black'

		}

		vm.getPatents = function(phase) {



			patentsService.fetchAllPatents()
				.then(
					function(response){

						vm.greenRenewals = [];
						vm.yellowRenewals = [];
						vm.redRenewals = [];
						vm.blueRenewals = [];
						vm.blackRenewals = [];

						vm.totalPatents = response.length;
					 	vm.labels = ["Green", "Yellow", "Red", "Blue", "Black"];

						response.forEach(function(item){

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

					}, 
					function(errResponse){
						console.log(errResponse)
					}
				)

				////////workings for carousel

				var phaseArr;
				var appNo, description, dueDate;

				switch(phase) {
					case 1:
						phaseArr = vm.greenRenewals;
					break;
					case 2:
						phaseArr = vm.yellowRenewals;
					break;
					case 3:
						phaseArr = vm.redRenewals;
					break;
					case 4:
						phaseArr = vm.blueRenewals;
					break;
					case 5:
						phaseArr = vm.blackRenewals;							
				}

			  	vm.active = 0;
			  	var slides = vm.slides = [];
			  	var currIndex = 0;

			 	vm.addSlide = function() {
				    // var newWidth = 600 + slides.length + 1;
				    slides.push({
				    	appNo: dueDate,
				      	appNo: description,
				      	id: currIndex++
				    });
			  	};

				  if(phaseArr !== undefined) {
					  for (var i = 0; i < phaseArr.length; i++) {
					    	vm.addSlide();
					    	var appNo = phaseArr[i];
						}
				  }

				  // console.log(appNo)
				
		}

		vm.getPatents();

		vm.selectColour = function(colour) {
			switch(colour) {
				case 'green':
					vm.colourPhaseTitle = {
						title: 'Green',
						descrip: 'Lorem'
					}
				break;
				case 'yellow':
					vm.colourPhaseTitle = {
						title: 'Yellow',
						descrip: 'Lorem'
					}
				break;
				case 'red':
					vm.colourPhaseTitle = {
						title: 'Red',
						descrip: 'Lorem'
					}
				break;
				case 'blue':
					vm.colourPhaseTitle = {
						title: 'Blue',
						descrip: 'Lorem'
					}
				break;
				case 'black':
					vm.colourPhaseTitle = {
						title: 'Black',
						descrip: 'Lorem'
					}
			}
		}



	}]		
})