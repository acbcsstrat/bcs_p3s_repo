app.component('dashboard', {
	bindings: { 
		patents: '<',
		transactions: '<' 
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: function($stateParams, $state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http, $rootScope, dashboardService, fxService, patentsRestService, $mdSidenav) {

		var vm = this;
		
		$rootScope.page = 'Dashboard';

		vm.$onInit = () => {

		 	$scope.toggleLeft = buildToggler('left');
    		$scope.toggleRight = buildToggler('right');

		    function buildToggler(componentId) {
		      	return function() {
		        	$mdSidenav(componentId).toggle();
		      	};
		    }



		    // $timeout(function() {
		    //     $scope.toggleLeft()
		    // }, 1000);

		    // $timeout(function() {
		    //     $scope.toggleLeft()
		    // }, 5000)

      		$scope.date = new Date()
	      	
			var transactions = vm.transactions;
			var patents = vm.patents;

			patentsRestService.fetchAllPatents()
				.then(
					function(response){
						response.forEach(function(item){
							patentsRestService.fetchCostAnalysis(item.id)
			                .then(
			                    function(response){

			                        switch(item.costBandColour) {
			                            case 'Green':

										var today = new Date().getTime();
										var start = new Date(response.greenStartDate);
										var end = new Date(response.amberStartDate);

										var total = end - start;
										var progress = today - start;

										vm.greenRenewals.forEach(function(data){
											data.progressBar =  Math.round(((progress) / (total)) * 100);
										})					                                

			                                break;
			                            case 'Amber':

										var today = new Date().getTime();
										var start = new Date(response.amberStartDate);
										var end = new Date(response.redStartDate);

										var total = end - start;
										var progress = today - start;

										vm.amberRenewals.forEach(function(data){
											data.progressBar =  Math.round(((progress) / (total)) * 100);
										})					                         

			                                break;
			                            case 'Red':

										var today = new Date().getTime();
										var start = new Date(response.redStartDate);
										var end = new Date(response.blueStartDate);

										var total = end - start;
										var progress = today - start;

										vm.redRenewals.forEach(function(data){
											data.progressBar =  Math.round(((progress) / (total)) * 100);
										})								

			                                break;
			                            case 'Blue':

										var today = new Date().getTime();
										var start = response.blueStartDate;
										var end = response.blackStartDate;

										var total = end - start;
										var progress = today - start;

										vm.blueRenewals.forEach(function(data){
											data.progressBar =  Math.round(((progress) / (total)) * 100);
										})

			                                break;
			                            case 'Black':

										var today = new Date().getTime();
										var start = response.blackStartDate;
										var end = response.blackEndDate;

										var total = end - start;
										var progress = today - start;

										vm.blackRenewals.forEach(function(data){
											data.progressBar =  Math.round(((progress) / (total)) * 100);
										})

			                        } //switch end
		                    
			        	
			                    }, 
			                    function(errResponse){
			                        console.log('no')
			                    }
		                    )
		            	})
			        
		                
					},
					function(errResponse){

					}
			)//patents request end

			//RECENT TRANSACTIONS

			vm.currentphase = 'blue';


			vm.recentTransArr = [];

			transactions.forEach(function(data){
				var d = new Date().getTime();
				var hours =  d - data.lastUpdatedDate;
				var recentTrans  = millsToHours(data, hours);
				if(recentTrans !== undefined) {
					vm.recentTransArr.push(recentTrans)
				}
			})

			function millsToHours(data, millisec) {

		        var seconds = (millisec / 1000).toFixed(0);
		        var minutes = Math.floor(seconds / 60);
		        var hours = "";

		        if (minutes > 59) {
		            hours = Math.floor(minutes / 60);
		            hours = (hours >= 10) ? hours : "0" + hours;
		            minutes = minutes - (hours * 60);
		            minutes = (minutes >= 10) ? minutes : "0" + minutes;
		        }

		        seconds = Math.floor(seconds % 60);
		        seconds = (seconds >= 10) ? seconds : "0" + seconds;

		        if (hours < 48) {
		            return data
		        }

		    }

		    //RECENT STAGE CHANGES

		    vm.recentStageArr = [];

		    //RECENT STAGE CHANGES

		    vm.recentRenewalArr = [];

			// vm.color = 0;

			vm.greenRenewals = [];
			vm.amberRenewals = [];
			vm.redRenewals = [];
			vm.blueRenewals = [];
			vm.blackRenewals = [];
			vm.noAction = [];

			//COLOUR KEY

			vm.selectedPhase;

			vm.colourKey = function(colour) {
				switch(colour) {
					case 0:
						vm.colourPhaseTitle = {
							title: 'Green',
							descrip: 'lorem',
							color: '#53ab58'
						}
					break;
					case 1:
						vm.colourPhaseTitle = {
							title: 'Yellow',
							descrip: 'loremmm',
							color: '#f9b233'						
						}
					break;
					case 2:
						vm.colourPhaseTitle = {
							title: 'Red',
							descrip: 'lorem ipsum',
							color: '#e30613'
						}
					break;
					case 3:
						vm.colourPhaseTitle = {
							title: 'Blue',
							descrip: '24 Week Extension',
							color: '#0097ce'					
						}
					break;
					case 4:
						vm.colourPhaseTitle = {
							title: 'Black',
							descrip: 'herisuhimas',
							color: '#3c3c3b'
						}
				}
			}

			//TOTAL RENEWALS PIE CHART

			vm.totalPatents = patents.length;

			vm.doughnutLabels = ["No action required", "Black", "Blue", "Red", "Yellow", "Green"];

			vm.doughnutColours = ['#d1d1d1', '#3c3c3b','#0097ce', '#e30613', '#f9b233','#53ab58'];

			patents.forEach(function(item){
				switch(item.costBandColour) {
					case 'Green':
						vm.greenRenewals.push(item)
					break;
					case 'Amber':
						vm.amberRenewals.push(item)
					break;
					case 'Red':
						vm.redRenewals.push(item)
					break;
					case 'Blue':
						vm.blueRenewals.push(item)
					break;
					case 'Black':
						vm.blackRenewals.push(item)
					break;
					case 'NoColor':

						vm.noAction.push(item)
				}


			
				vm.doughnutData = [vm.noAction.length, vm.blackRenewals.length, vm.blueRenewals.length, vm.redRenewals.length, vm.amberRenewals.length, vm.greenRenewals.length];

				vm.doughnutOptions = {
				   showToolTips: true,
				   tooltipEvents: [],
				   animation: {
				   	onComplete: function() {
						var chartInstance = this.chart;
						var ctx = chartInstance.ctx;
						console.log(ctx)
					      // this.showTooltips(this.config.data.datasets[0].doughnut,true);
					   }
				   }
			   
			};

			})

			vm.phaseSliderInfo = function(id) {

				vm.phaseArr = [];

				var phase;

				switch(id) {
					case 0:
						phase = vm.greenRenewals;
					break;
					case 1:
						phase = vm.amberRenewals;
					break;
					case 2:
						phase = vm.redRenewals;
					break;
					case 3:
						phase = vm.blueRenewals;
					break;
					case 4:
						phase = vm.blackRenewals;								
				}
				
				function loadPhase(i) {
					vm.phaseArr.length = 0;
						$timeout(function() {
							vm.phaseArr = i;
						}, 100);

				}

				loadPhase(phase)

		  	} //phaseSliderInfoEnd

		} //$onInit end	


		$scope.currentIndex = 0;

	    $scope.slickConfig = {
	    	arrows: true,
		    enabled: true,
		    autoplay: false,
		    draggable: false,
		    autoplaySpeed: 3000,
		    method: {},
		    event: {
		    	afterChange: function (event, slick, currentSlide, nextSlide) {
	        		$scope.currentIndex = currentSlide;

	        		function patentFx(i) {
	        			vm.selectedPatent = vm.phaseArr[i];
						var fees = vm.phaseArr[i].feeUI;
	        			vm.todaysPriceUSD = fees.subTotalUSD;
	        			vm.todaysPriceEUR = fees.subTotalEUR;
	        			vm.selecetedPatent = i;
	        			vm.totalCostUSD = fees.subTotalUSD;
	        			$timeout(function() {
	        				fxService.fetchFxWeek()
				        	.then(
				        		function(data){
				        			var dateArr = [];
				        			//weekly

				        			data.forEach(function(item){
				        				dateArr.push(item.rateActiveDate)
				        			});

				        			dateArr.sort(function(a, b){
				        				return a - b
				        			});        			

				        			var tD = new Date().getTime();
				        			var lwD = tD - 604800000; //subtract a week in milliseconds
				        			var lastWeekD = new Date(lwD).getDay();
				        			var lastWeekDt = new Date(lwD).getDate();
				        			// console.log(lastWeekD, lastWeekDt)
				        			dateArr.forEach(function(item, index){
				        				//yesterday
				        				if(item == dateArr[0]) {
				        					var yesterdayFx = data[index].rate;
				        					vm.yesterdaysPriceUSD = Math.floor(fees.subTotalEUR * yesterdayFx);
				        					vm.yesterdaysPriceEUR = Math.floor(fees.subTotalEUR);
				        				}
				        				//weekly

				        				if((new Date(item).getDay() == lastWeekD)) { //NEEDS TO BE FIXED
				        					var lastWeekFx = data[index].rate;
				        					vm.lastWeeksPriceUSD = Math.floor(fees.subTotalEUR * lastWeekFx);
				        					vm.lastWeeksPriceEUR = Math.floor(fees.subTotalEUR);
				        				}
				        			})
				        		},
				        		function(error){

				        		}
				    		)

				    		fxService.fetchFxMonth()
				        	.then(
				        		function(data){

				        			var dateArr = [];

				        			data.forEach(function(item){
				        				dateArr.push(item.rateActiveDate)
				        			});

				        			dateArr.sort(function(a, b){
				        				return a - b
				        			});

				        			var tD = new Date().getTime();
				        			var lmD = tD - 2629746000; //subtract a month in milliseconds
				        			var lastMonthD = new Date(lmD).getDay();
				        			var lastMonthDt = new Date(lmD).getDate();

				        			dateArr.forEach(function(item, index){
				        				if((new Date(item).getDay() == lastMonthD) && (new Date(item).getDate() == lastMonthDt)) {
				        					var lastMonthFx = data[index].rate;
				        					vm.lastMonthsPriceUSD = Math.floor(fees.subTotalEUR * lastMonthFx);
				        					vm.lastMonthsPriceEUR = Math.floor(fees.subTotalEUR);
				        				}
				        			})
				        		},
				        		function(error){

				        		}
				    		)	
	        			}, 100);
					}
	        		patentFx($scope.currentIndex)
		        },
		    	init: function(event, slick, currentSlide, nextSlide) {
		    		slick.slickGoTo($scope.currentIndex);
		    	}
		    }
		};

		

	}
})
