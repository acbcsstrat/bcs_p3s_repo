app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: ['$scope', 'Idle', 'Keepalive', '$uibModal', '$timeout', '$http', '$rootScope', 'patentsRestService', function($scope, Idle, Keepalive, $uibModal, $timeout, $http, $rootScope, patentsRestService) {

		var vm = this;

		$rootScope.page = 'List Patents';

		vm.patentsTabs = {
			all: 1,
			green: 2,
			amber: 3,
			red: 4,
			blue: 5,
			black: 6
		}

		vm.$onInit = () => {

			var allPatents = [];
			var greenPatents = [];
			var amberPatents = [];
			var redPatents = [];
			var bluePatents = [];
			var blackPatents = [];

			vm.date = new Date()

			var patents = vm.patents;

			patents.forEach(function(item){

				if(item.costBandColour) {
	     			allPatents.push(item)
			     	if(allPatents.length === 0) {
						vm.allPatentsLength = 0;
					} else {
						vm.allPatentsLength = allPatents.length
					}
	     		} else {
	     			vm.patents = null;
	     		}

				switch(item.costBandColour) {
					case 'Green':
						greenPatents.push(item);
					break;
					case 'Amber':
						amberPatents.push(item)
					break;
					case 'Red':
						redPatents.push(item)
					break;
					case 'Blue':
						bluePatents.push(item)
					break;
					case 'Black':
						blackPatents.push(item)
					break;
					default: vm.patents = null;																								
				}

		     	if(greenPatents.length === 0) { 
	 				vm.greenPatentsLength = 0;
	 			} else {
	 				vm.greenPatentsLength = greenPatents.length
	 			}
		     	if (amberPatents.length === 0) {
	 				vm.amberPatentsLength = 0;
	 			} else {
	 				vm.amberPatentsLength = amberPatents.length
	 			}
	 			if(redPatents.length === 0) {
	 				vm.redPatentsLength = 0;
	 			} else {
	 				vm.redPatentsLength = redPatents.length;
	 			}
	 			if(bluePatents.length === 0) {
	 				vm.bluePatentsLength = 0;
	 			} else {
	 				vm.bluePatentsLength = bluePatents.length
	 			}
	 			if(blackPatents.length == 0) {
	 				vm.blackPatentsLength = 0;
	 			} else {
	 				vm.blackPatentsLength = blackPatents.length
	 			}

	 			function calcProgress(start, end) {

					var today = new Date().getTime();

					var total = end - start;
					var progress = today - start;

					return Math.round(((progress) / (total)) * 100);

	 			}

				patentsRestService.fetchCostAnalysis(item.id)
                .then(
                    function(response){

                        switch(item.costBandColour) {
                            case 'Green':

							var start = new Date(response.greenStartDate);
							var end = new Date(response.amberStartDate);

							item.progressBar = calcProgress(start, end);						                                  

                                break;
                            case 'Amber':

							var start = new Date(response.amberStartDate);
							var end = new Date(response.redStartDate);

							item.progressBar = calcProgress(start, end);                          

                                break;
                            case 'Red':

							var start = new Date(response.redStartDate);
							var end = new Date(response.blueStartDate);

							item.progressBar = calcProgress(start, end);

                                break;
                            case 'Blue':

							var start = response.blueStartDate;
							var end = response.blackStartDate;

							item.progressBar = calcProgress(start, end);

                                break;
                            case 'Black':

							var start = response.blackStartDate;
							var end = response.blackEndDate;

							item.progressBar = calcProgress(start, end);

                        }
        
                    }, 
                    function(errResponse){
                        console.log(errResponse)
                    }
                )
			})

	  		vm.displayPhase = function(id) {
				switch (id) {
				    case 1:
				     	vm.patents = allPatents;
				        break;
				    case 2:
				     	vm.patents = greenPatents;
				        break;
				    case 3:
				     	vm.patents = amberPatents;
				        break;
				    case 4:
				     	vm.patents = redPatents;
				        break;
				    case 5:
				     	vm.patents = bluePatents;
				     	break;
			     	case 6:
				    	vm.patents = blackPatents;
				}
			}
		}

	   	vm.sortType     = 'patentApplicationNumber'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order		
   
	}
]});