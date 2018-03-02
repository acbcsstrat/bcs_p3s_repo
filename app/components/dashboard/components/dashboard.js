app.component('dashboard', {
	bindings: { 
		patents: '<',
		transHistory: '<',
		currTrans: '<'
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: ['$state', '$scope', '$uibModal', '$timeout', '$http', '$rootScope', 'fxService', 'patentsRestService', 'patentsService', 'currentTransactionsService', 'dashboardService', 'localStorageService', '$filter', '$location', '$anchorScroll',function($state, $scope, $uibModal, $timeout, $http, $rootScope, fxService, patentsRestService, patentsService, currentTransactionsService, dashboardService, localStorageService, $filter, $location,  $anchorScroll) {

		var vm = this;
		
		$rootScope.page = 'Dashboard';

	    $timeout(function() {
	      vm.animate = true;
	    }, 100);

	    vm.date = new Date().getTime();

		vm.greenRenewals = [];
		vm.amberRenewals = [];
		vm.redRenewals = [];
		vm.blueRenewals = [];
		vm.blackRenewals = [];
		vm.greyRenewals = [];

		vm.$onInit = function() {

			var counter = localStorageService.get('counter');

			var currTrans = vm.currTrans;
			var transHistory = vm.transHistory;
			var patents = vm.patents;
 
			if(patents) {

				vm.totalPatents = patents.length;

				patents.forEach(function(item){

					if(item.renewalStatus !== 'Renewal in place' && item.renewalStatus !== 'Too late to renew' && item.renewalStatus !== 'No renewal needed'  && item.renewalStatus !== 'Way too late to renew') {

						switch(item.costBandColour) {
							case 'Green':
								vm.greenRenewals.push(item);
							break;
							case 'Amber':
								vm.amberRenewals.push(item);
							break;
							case 'Red':
								vm.redRenewals.push(item);
							break;
							case 'Blue':
								vm.blueRenewals.push(item);
							break;
							case 'Black':
								vm.blackRenewals.push(item);
							break;

						}

					} else {
						vm.greyRenewals.push(item);
					}
				});				

				patents.forEach(function(item){
					patentCostAnalysisFn(patents, item.id);
				})

			} else {
				vm.totalPatents = 0;
			} //conditional end

			if(currTrans) {
				currTrans.forEach(function(data){
		
					var hours =  vm.date - data.lastUpdatedDate;
					var recentTrans  = recentActivityFn(hours);

					if(recentTrans) {
						vm.recentTransArr.push(data);
					}

					if(recentTrans && data.latestTransStatus === 'Completed') {
						vm.recentRenewalArr.push(data);
					}
				});	
			}

			$timeout(function() {
				vm.greenRenewals.forEach(function(data, i){
					data.progressBar = calculateProgress(data, i);
				});
				vm.amberRenewals.forEach(function(data, i){
					data.progressBar = calculateProgress(data, i);
				});
				vm.redRenewals.forEach(function(data, i){
					data.progressBar = calculateProgress(data, i);
				});
				vm.blueRenewals.forEach(function(data, i){
					data.progressBar = calculateProgress(data, i);
				});
				vm.blackRenewals.forEach(function(data, i){
					data.progressBar = calculateProgress(data, i);
				});												
			}, 100);			

		}; //$onInit end

		function loadPhase(phase) {

			$timeout(function() {
				vm.selectedPatents = phase;
			}, 100);
		}

		vm.selectedPhase = {};

		vm.selectedPhaseInit = function(phase) {

			vm.selectedPatents = [];

			switch(phase) {

				case 'green':

					vm.selectedPhase.title ='Green';
					vm.selectedPhase.bgClass = 'bg-phase-green';
					vm.selectedPhase.nextBgClass = 'bg-phase-amber';
					vm.selectedPhase.index = 0;
					loadPhase(vm.greenRenewals);
				
				break;
				case 'amber':

					vm.selectedPhase.title ='Amber';
					vm.selectedPhase.bgClass = 'bg-phase-amber';
					vm.selectedPhase.nextBgClass = 'bg-phase-red';					
					vm.selectedPhase.index = 1;
					loadPhase(vm.amberRenewals);

				break;
				case 'red':

					vm.selectedPhase.title ='Red';
					vm.selectedPhase.bgClass = 'bg-phase-red';
					vm.selectedPhase.nextBgClass = 'bg-phase-blue';
					vm.selectedPhase.index = 2;
					loadPhase(vm.redRenewals);

				break;
				case 'blue':

					vm.selectedPhase.title ='Blue';
					vm.selectedPhase.bgClass = 'bg-phase-blue';
					vm.selectedPhase.nextBgClass = 'bg-phase-black';
					vm.selectedPhase.index = 3;
					loadPhase(vm.blueRenewals);

				break;
				case 'black':

					vm.selectedPhase.title ='Black';
					vm.selectedPhase.bgClass = 'bg-phase-black';
					vm.selectedPhase.nextBgClass = 'bg-phase-white';					
					vm.selectedPhase.index = 4;
					vm.selectedPatents = vm.blackRenewals;
					loadPhase(vm.blackRenewals);					

				break;
				case 'grey':

					vm.selectedPhase.title ='Grey';
					vm.selectedPhase.bgClass = '#dbdbdb';
					vm.selectedPhase.index = 5;
					vm.selectedPatents = [];

				break;

			}

		}

		vm.selectedPhaseInit('green');

		chartValueArrs = [];

		fxService.fetchFxMonth()
		.then(
			function(response){
				for(var i = 0; i < response.length; i++) {
					chartValueArrs.push([response[i].rateActiveDate, response[i].rate]);
				}
			},
			function(errResponse) {
				
			}
		)

		$timeout(function() {

			vm.lineOptions = {
				chart: {
	                type: 'lineChart',
	                height: 450,
	                margin : {
	                    top: 20,
	                    right: 20,
	                    bottom: 55,
	                    left: 55
	                },
	                showLegend: false,
	                x: function(d, i){ 
	                	return d[0]},
	                y: function(d){ return d[1]; },
	                useInteractiveGuideline: true,
	                xAxis: {
			            tickFormat: function (d, i) {
			                return d3.time.format('%x')(new Date(d));
			            },

			            showMaxMin: false,
			            rotateLabels: -30,
			            ticks: 24        
	                },
	                xScale: d3.time.scale(),
	                yAxis: {
	                    tickFormat: function(d){
	                        return d3.format('.04f')(d);
	                    },
	                    axisLabelDistance: -10,
	                    ticks: 10,
	                    showMaxMin: false
	                },
	                tooltip: {
	                    keyFormatter: function(d) {
	                        return d3.time.format('%x')(new Date(d));
	                    }
	                },		                
	                useVoronoi: false,
			        lines: {
			            interactive: true
			        },
			        showXAxis: true,
			        showYAxis: true,
			        // forceY: [0],	           
	                callback: function(chart){

	                }
	            }
			}

            vm.xAxisTickFormat = function(){
                return function(d){
                    return d3.time.format('%x')(new Date(d));  //uncomment for date format
                }
            }

		 	function chartDatafn() {

		   		return [
		   			{
		   				values: chartValueArrs.reverse(),
		   				color: '#2ca02c'
		   			}
		   		]

	      	} //function end

	      	vm.lineData = chartDatafn();

	      	vm.donutOptions = {
	            chart: {
	                type: 'pieChart',
	                height: 250,
	                donut: true,
	                margin: { top: 0, right: 0, bottom: 0, left: 0 },
	                x: function(d){
	                	return d.key;
	                },
	                y: function(d){
	                	return d.y;
	                },
	                showLabels: false,
	                pie: {
	                  dispatch: {
	                    elementClick: function(e) {
                    		var key = e.data.key;
	                      	switch(key) {
		                      	case 'green':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 0;
		                      	break;
		                      	case 'amber':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 1;
		                      	break;
		                      	case 'red':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 2;
		                      	break;
		                      	case 'blue':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 3;
		                      	break;
		                      	case 'black':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 4;
		                      	break;
		                      	case 'grey':
		                      		vm.selectedPhaseInit(key);
		                      		$scope.activeTab = 5;                      	  	                      	              		                      		                      	
	                      	}
	                    },     
	                },
                    startAngle: function(d) { return d.startAngle -Math.PI },
                    endAngle: function(d) { return d.endAngle -Math.PI }
	                },
	                duration: 500,
	                growOnHover: true,
	                showLegend: false,
	                labelFormat: function(d) {
	                	return d;
	                }
	            }
	        };

	        vm.donutData = [
	        	{
	        		key: 'green', 
	        		y: vm.greenRenewals.length,
	        		color: '#53ab58'
	        	},
	        	{
	        		key: 'amber', 
	        		y: vm.amberRenewals.length,
	        		color: '#f9b233'
	        	},
	        	{
	        		key: 'red', 
	        		y: vm.redRenewals.length,
	        		color: '#e30613'
	        	},
	        	{
	        		key: 'blue',
	        		y: vm.blueRenewals.length,
	        		color: '#0097ce'
	        	},
	        	{
	        		key: 'black', 
	        		y: vm.blackRenewals.length,
	        		color: '#3c3c3b'
	        	},
	        	{
	        		key: 'grey', 
	        		y: vm.greyRenewals.length,
	        		color: '#dbdbdb'
	        	}
	        ]
      	}, 200);



		vm.fetchItemRenewal = function() {
			patentsService.activePatentItemMenu();
		};

		vm.fetchItemTransaction = function(id) {
			currentTransactionsService.fetchCurrentTransactions()
			.then(
				function(response) {
					response.forEach(function(data) {
						const transId = data.id;
						data.renewalUIs.forEach(function(data, i) {
							if(data.patentUI.id == id) {
								$state.go('current-transactions.current-transaction-item',{transId: transId})
								.then(
									function(response){
										$timeout(function() {
											$location.hash('currTransAnchor');
										  	$anchorScroll();
										}, 300);
									},
									function(errResponse){
										console.log(errResponse);
									}
								);								
							}
						});
					});
				},
				function(errResponse) {
					console.log(errResponse);
				}
			);
		};



		vm.fxPeriodActive = function(fxActive) {
			switch(fxActive) {
				case 0:
					vm.renewalfxTimeframe = 'Today';
				break;
				case 1:
					vm.renewalfxTimeframe = 'Yesterday';
				break;
				case 2:
					vm.renewalfxTimeframe = 'Last Week';
				break;
				case 3:
					vm.renewalfxTimeframe = 'Last Mth';											
			}				
		};


		function selectedPatentFx(patent) { 

			if(patent) {

				fxService.fetchFxWeek()
		    	.then(
		    		function(data){

		    			var dateArr = [];
		    			//weekly
		    			data.forEach(function(item){
		    				dateArr.push(item.rateActiveDate);
		    			});

		    			dateArr.sort(function(a, b){
		    				return a - b;
		    			});

		    			dateArr.forEach(function(item, index){
		    				if(item == dateArr[0]) {
		    					var todaysFx = data[index].rate;
		    					vm.todaysPriceUSD = parseFloat(patent.subTotalEUR * todaysFx).toFixed(2);
		    					vm.todaysPriceEUR = parseFloat(patent.subTotalEUR).toFixed(2);
		    				}
		    				// console.log(vm.todaysPriceUSD, dateArr, data)
		    				//yesterday
		    				 if(item == dateArr[1]) {	
		    					var yesterdayFx = data[index].rate;
		    					vm.yesterdaysPriceUSD = parseFloat(patent.subTotalEUR * yesterdayFx).toFixed(2);
		    					vm.yesterdaysPriceEUR = parseFloat(patent.subTotalEUR).toFixed(2);
		    				}
		    				//weekly
		    				if(item == dateArr[7]) { 
		    					var lastWeekFx = data[index].rate;
		    					vm.lastWeeksPriceUSD = parseFloat(patent.subTotalEUR * lastWeekFx).toFixed(2);
		    					vm.lastWeeksPriceEUR = parseFloat(patent.subTotalEUR).toFixed(2);
		    				}
		    			});
		    		},
		    		function(error){

		    		}
				);

				fxService.fetchFxMonth()
		    	.then(
		    		function(data){

		    			var tD = new Date();
		    			var lmD = tD.setMonth(tD.getMonth() - 1);
		    			var lastMonthD = new Date(lmD).getDay();
		    			var lastMonthDt = new Date(lmD).getDate();

		    			data.forEach(function(item, index){
		    				if((new Date(item.rateActiveDate).getDay() == lastMonthD) && (new Date(item.rateActiveDate).getDate() == lastMonthDt)) {
		    					var lastMonthFx = item.rate;
		    					vm.lastMonthsPriceUSD = parseFloat(patent.subTotalEUR * lastMonthFx).toFixed(2);
		    					vm.lastMonthsPriceEUR = parseFloat(patent.subTotalEUR).toFixed(2);
		    				}
		    			});

	    				var fwSaving = parseFloat(vm.todaysPriceUSD - vm.lastMonthsPriceUSD).toFixed(2);

	    				if(fwSaving < 0) {
	    					vm.variationSave = true;
	    					vm.fourWeekVariation = fwSaving.toString().replace('-', '');
	    				} else {
	    					vm.variationSave = false;
	    					vm.fourWeekVariation = fwSaving;
	    				}		        				
		    			
		    		},
		    		function(error){

		    		}
				);
		    }
	    }
		    	
		function calcProgress(start, end) {

			var today = new Date().getTime();

			var total = end - start;
			var progress = today - start;

			return Math.round(((progress) / (total)) * 100);

		}				

		function calculateProgress(data, i) {
	
			patentsRestService.fetchCostAnalysis(data.id)
			.then(
				function(response) {
                    switch(response.currentcostBand) {
                        case 'Green':
							data.progressBar = calcProgress(response.greenStartDate, response.amberStartDate);
						break;
						case 'Amber':
							data.progressBar = calcProgress(response.amberStartDate, response.redStartDate);
						break;
						case 'Red':
							data.progressBar = calcProgress(response.redStartDate, response.blueStartDate);
						break;
						case 'Blue':
							data.progressBar = calcProgress(response.blueStartDate, response.blackStartDate);
						break;
						case 'Black':
							if(data.renewalStatus == 'Show price') {
								data.progressBar = calcProgress(response.blackStartDate, response.blackPhoneUpStart);
							} 							
					}
				},
				function(errResponse) {
					// body...
				}
			)
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
	        		vm.selectedPatent = vm.selectedPatents[vm.currentIndex];
	        		if(vm.selectedPatent.feeUI !== null) {
	        			selectedPatentFx(vm.selectedPatent.feeUI);
	        		}
	        		
	        	},
	        	init: function (event, slick) {
	              	slick.slickGoTo(vm.currentIndex); // slide to correct index when init
	            }
	        }
	    }

	}


]});
