app.component('dashboard', {
	bindings: { 
		patents: '<',
		transactions: '<'
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: ['$state', '$scope', '$uibModal', '$timeout', '$http', '$rootScope', 'fxService', 'patentsRestService', 'patentsService', 'currentTransactionsService', 'dashboardService', 'localStorageService', '$filter', function($state, $scope, $uibModal, $timeout, $http, $rootScope, fxService, patentsRestService, patentsService, currentTransactionsService, dashboardService, localStorageService, $filter) {

		var vm = this;
		
		$rootScope.page = 'Dashboard';

	    vm.animate = false;

	    vm.date = new Date().getTime();

		var patentsArr = [];

		var systemResponse = [];
		var urgentResponse = [];

		vm.recentTransArr = [];
		vm.recentRenewalArr = [];	

		vm.greenRenewals = [];
		vm.amberRenewals = [];
		vm.redRenewals = [];
		vm.blueRenewals = [];
		vm.blackRenewals = [];
		vm.greyRenewals = [];

		var messageObj = {};
		var messageArr = [];

		chartValueArrs = [];

		dashboardService.fetchFxrates()
		.then(
			function(response){
				for(var i = 0; i < response.length; i++) {
					chartValueArrs.push([response[i].rateActiveDate, response[i].rate]);
				}
			},
			function(errResponse) {
				// body...
			}
		)

		$timeout(function() {

				vm.chartOptions = {
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
		                useInteractiveGuideline: false,
		                dispatch: {
		                    stateChange: function(e){ console.log("stateChange"); },
		                    changeState: function(e){ console.log("changeState"); },
		                    tooltipShow: function(e){ console.log("tooltipShow"); },
		                    tooltipHide: function(e){ console.log("tooltipHide"); }
		                },
		                xAxis: {
				            tickFormat: function (d, i) {
				                return d3.time.format('%x')(new Date(d));
				            },

				            showMaxMin: false,
				            rotateLabels: -30,
				            ticks: 8        
		                },
		                xScale: d3.time.scale(),
		                yAxis: {
		                    tickFormat: function(d){
		                        return d3.format('.04f')(d);
		                    },
		                    axisLabelDistance: -10,
		                    ticks: 8,
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

				vm.chartData = chartDatafn();

		            $scope.xAxisTickFormat = function(){
		                return function(d){
		//                    return d3.time.format('%X')(new Date(d));  //uncomment for time format
		                    return d3.time.format('%x')(new Date(d));  //uncomment for date format
		                }
		            }                

				 	function chartDatafn() {

				   		return [
				   			{
				   				values: chartValueArrs,
				   				color: '#2ca02c'
				   			}
				   		]			   			

			      	} //function end

      	}, 200);	

	    $timeout(function() {
	      vm.animate = true;
	    }, 100);

		patentsRestService.fetchAllPatents()
		.then(
			function(response){
				response.forEach(function(item){
					patentsArr.push(item);
				});
			},
			function(errResponse) {
				console.log(errResponse);
			}
		);

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
	            return data;
	        }

	    }

		function calcProgress(start, end) {

			var today = new Date().getTime();

			var total = end - start;
			var progress = today - start;

			return Math.round(((progress) / (total)) * 100);

		}	

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
								$state.go('current-transactions.current-transaction-item',{transId: transId});
							}
						});
					});
				},
				function(errResponse) {
					console.log(errResponse);
				}
			);
		};

		vm.activityNotifications = [
			{
				activity: 'Stage Change',
				index: 0
			},
			{
				activity: 'Transactions',
				index: 1
			},
			{
				activity: 'Renewals',
				index: 2
			}
		];

		vm.activeMenu = vm.activityNotifications[0].activity;

		vm.setActivityActiveTab = function(menuItem, index) {
			vm.activeActivityTabResp = index;
			vm.activeMenu = menuItem;
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

		//suppresing system messages

		vm.checkedMessages = function(id, checked) {

			if(checked) {
				messageArr.push(id);
				vm.message = true;
			} else {
				messageArr.splice(-1, 1);
			}

			if(messageArr.length === 0) {
				vm.message = false;				
			}

		};

		messageObj.messageArr = messageArr;

		vm.supresssMessages = function() {
			dashboardService.supressMessages(messageObj);
		};

		function patentFx(i) {
			vm.selectedPatent = vm.phaseArr[i];

			var fees = vm.phaseArr[i].feeUI;
			if(fees !== null) {
    			$timeout(function() {
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
		        					vm.todaysPriceUSD = Math.floor(fees.subTotalEUR * todaysFx);
		        					vm.todaysPriceEUR = Math.floor(fees.subTotalEUR);
		        				}
		        				// console.log(vm.todaysPriceUSD, dateArr, data)
		        				//yesterday
		        				// if(item == dateArr[1]) {
		        				 if(item == dateArr[1]) {	
		        					var yesterdayFx = data[index].rate;
		        					vm.yesterdaysPriceUSD = Math.floor(fees.subTotalEUR * yesterdayFx);
		        					vm.yesterdaysPriceEUR = Math.floor(fees.subTotalEUR);
		        				}
		        				//weekly
		        				if(item == dateArr[7]) { 
		        					var lastWeekFx = data[index].rate;
		        					vm.lastWeeksPriceUSD = Math.floor(fees.subTotalEUR * lastWeekFx);
		        					vm.lastWeeksPriceEUR = Math.floor(fees.subTotalEUR);
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
		        					vm.lastMonthsPriceUSD = Math.floor(fees.subTotalEUR * lastMonthFx);
		        					vm.lastMonthsPriceEUR = Math.floor(fees.subTotalEUR);
		        				}
		        			});

		        			$timeout(function(){
		        				vm.fourWeekVariation =  Math.floor(vm.todaysPriceUSD - vm.lastMonthsPriceUSD);
		        				if(vm.fourWeekVariation < 0) {
		        					vm.variationSave = false;
		        				} else {
		        					vm.variationSave = true;
		        				}
		        			}, 100);

		        		},
		        		function(error){

		        		}
		    		);
		    		
    			}, 100);

			} //if

		} //function end		

		vm.phaseObj = {
			colourKey: function(colour) {

				vm.phaseArr = [];
				vm.sliderPhase;
				var phase;

				switch(colour) {
					case 0:
						vm.sliderPhase = 'green';
						phase = vm.greenRenewals;
						vm.colourPhaseTitle = {
							title: 'Green',
							color: '#53ab58'
						};
					    $scope.slickConfigGreen = {
					    	arrows: true,
						    enabled: true,
						    autoplay: false,
						    draggable: false,
						    autoplaySpeed: 3000,
						    method: {},
						    event: {
						    	afterChange: function (event, slick, currentSlide, nextSlide) {
					        		$scope.currentIndex = currentSlide;
					        		vm.currIndexForTitle = (currentSlide + 1);
					        		patentFx($scope.currentIndex);
						        }, //afterchange end
						    	init: function(event, slick) {
						    		slick.slickGoTo($scope.currentIndex);
						    	}
						    }
						};						
					break;
					case 1:
						vm.sliderPhase = 'amber';
						phase = vm.amberRenewals;
						vm.colourPhaseTitle = {
							title: 'Amber',
							color: '#f9b233'						
						};
					    $scope.slickConfigAmber = {
					    	arrows: true,
						    enabled: true,
						    autoplay: false,
						    draggable: false,
						    autoplaySpeed: 3000,
						    method: {},
						    event: {
						    	afterChange: function (event, slick, currentSlide, nextSlide) {
					        		$scope.currentIndex = currentSlide;
					        		vm.currIndexForTitle = (currentSlide + 1);
					        		patentFx($scope.currentIndex);
						        }, //afterchange end
						    	init: function(event, slick) {
						    		slick.slickGoTo($scope.currentIndex);
						    	}
						    }
						};
					break;
					case 2:
						vm.sliderPhase = 'red';
						phase = vm.redRenewals;		
						vm.colourPhaseTitle = {
							title: 'Red',
							color: '#e30613'
						};
					    $scope.slickConfigRed = {
					    	arrows: true,
						    enabled: true,
						    autoplay: false,
						    draggable: false,
						    autoplaySpeed: 3000,
						    method: {},
						    event: {
						    	afterChange: function (event, slick, currentSlide, nextSlide) {
					        		$scope.currentIndex = currentSlide;
					        		vm.currIndexForTitle = (currentSlide + 1);
					        		patentFx($scope.currentIndex);
						        }, //afterchange end
						    	init: function(event, slick) {
						    		slick.slickGoTo($scope.currentIndex);
						    	}
						    }
						};						
					break;
					case 3:
						vm.sliderPhase = 'blue';
						phase = vm.blueRenewals;				
						vm.colourPhaseTitle = {
							title: 'Blue',
							color: '#0097ce'					
						};
						$scope.slickConfigBlue = {
							arrows: true,
						    enabled: true,
						    autoplay: false,
						    draggable: false,
						    autoplaySpeed: 3000,
						    method: {},
						    event: {
						    	afterChange: function (event, slick, currentSlide, nextSlide) {
						    		$scope.currentIndex = currentSlide;
						    		vm.currIndexForTitle = (currentSlide + 1);
						    		patentFx($scope.currentIndex);
						        }, //afterchange end
						    	init: function(event, slick) {
						    		slick.slickGoTo($scope.currentIndex);
						    	}
						    }
						};	   						
					break;
					case 4:
						vm.sliderPhase = 'black';
						phase = vm.blackRenewals;					
						vm.colourPhaseTitle = {
							title: 'Black',
							color: '#3c3c3b'
						};
					    $scope.slickConfigBlack = {
					    	arrows: true,
						    enabled: true,
						    autoplay: false,
						    draggable: false,
						    autoplaySpeed: 3000,
						    method: {},
						    event: {
						    	afterChange: function (event, slick, currentSlide, nextSlide) {
					        		$scope.currentIndex = currentSlide;
					        		vm.currIndexForTitle = (currentSlide + 1);
					        		patentFx($scope.currentIndex);
						        }, //afterchange end
						    	init: function(event, slick) {
						    		slick.slickGoTo($scope.currentIndex);
						    	}
						    }
						};							
					break;
					case 5:
						vm.colourPhaseTitle = {
							title: 'Grey',
							color: '#bdbdbd'
						};
				}

				function loadPhase(i) {
					vm.phaseArr.length = 0;
					$timeout(function() {
						vm.phaseArr = i;
					}, 100);
				}

				loadPhase(phase);

			}	
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
							data.progressBar = calcProgress(response.blackStartDate, response.blackEndDate);
					}
				},
				function(errResponse) {
					// body...
				}
			)
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

		function patentCostAnalysisFn(id) {

			var hours;

			patentsRestService.fetchCostAnalysis(id)
			.then(
				function(response){

					vm.recentStageArr = [];

                    switch(response.currentcostBand) {
                        case 'Green':

	                    	hours =  vm.date - response.greenStartDate;

	                    	if(millsToHours(response, hours) !== undefined){
	                    		patentsArr.forEach(function(item) {
	                    			if(item.costBandColour == 'Green') {
	                    				vm.recentStageArr.push(item);
                              			item.nextCostBandColor = 'Amber';
	                    			}
	                    		});
	                    	}

						break;
						case 'Amber':

	                    	hours =  vm.date - response.amberStartDate;

	                    	if(millsToHours(response, hours) !== undefined){
	                    		patentsArr.forEach(function(item) {
	                    			if(item.costBandColour == 'Amber') {	                    		
	                    				vm.recentStageArr.push(item);
	                    				item.nextCostBandColor = 'Red';
	                    			}
	                    		});
	                    	}

						break;
						case 'Red':

							hours =  vm.date - response.redStartDate;

	                    	if(millsToHours(response, hours) !== undefined){
	                    		patentsArr.forEach(function(item) {
	                    			if(item.costBandColour == 'Red') {	                    		
	                    				vm.recentStageArr.push(item);
	                    				item.nextCostBandColor = 'Blue';
	                    			}
	                    		});
	                    	}

						break;
						case 'Blue':

							hours =  vm.date - response.blueStartDate;

	                    	if(millsToHours(response, hours) !== undefined){
	                    		patentsArr.forEach(function(item) {
	                    			if(item.costBandColour == 'Blue') {	                    		
	                    				vm.recentStageArr.push(item);
	                    				item.nextCostBandColor = 'Black';                
	                    			}
	                    		});
	                    	}

						break;
						case 'Black':

							hours =  vm.date - response.blackStartDate;

	                    	if(millsToHours(response, hours) !== undefined){
	                    		patentsArr.forEach(function(item) {
	                    			if(item.costBandColour == 'Black') {	                    		
	                    				vm.recentStageArr.push(item);
	                    				item.nextCostBandColor = 'Grey';                              
	                    			}
	                    		});
	                    	}

					}
				},
				function(errResponse) {
					// body...
				}
			);
		}

		
		$scope.currentIndex = 0;

		//COLOUR KEY	


		vm.$onInit = () => {

			var counter = localStorageService.get('counter');

			var transactions = vm.transactions;
			var patents = vm.patents;
 			
 			$timeout(function() {
				patents.forEach(function(item){
					patentCostAnalysisFn(item.id);
				})
 			}, 300)

			function systemMessageModal(response) {
				var modalInstance = $uibModal.open({
					templateUrl: 'p3sweb/app/components/dashboard/views/modals/system-message-modal.htm',
					scope: $scope,
					controllerAs: vm,
					controller: function($uibModalInstance, message) {

						vm.systemMessage = message;

				 	  	vm.systemOk = function () {
					    	$uibModalInstance.close();
					  	};

					  	vm.systemDismissModal = function() {
					  		$uibModalInstance.dismiss();
					  	};							  	

					},
					resolve: {
						message: function() {
							return systemResponse;
						}
					}
				});
		 	} //function systemMessageModal

			function urgentPatentModal(response) {
				var modalInstance = $uibModal.open({
					templateUrl: 'p3sweb/app/components/dashboard/views/modals/urgent-message-modal.htm',
					scope: $scope,
					controllerAs: vm,
					controller: function($uibModalInstance, message) {

						vm.urgentPatents = message;

				 	  	vm.urgentOk = function () {
					    	$uibModalInstance.close();
					  	};

					  	vm.urgentDismissModal = function() {
					  		$uibModalInstance.dismiss();
					  	};

					},
					resolve: {
						message: function() {
							return urgentResponse;
						}
					}
				});
		 	} //function urgentPatentModal		 	


		    if(counter === null) {

		    	localStorageService.set('counter', 1);

		    	counter = localStorageService.get('counter');

		    	dashboardService.getMessages()
			    .then(
			    	function(response){

			    		var date = new Date().getTime();

		    			if(response.urgentPatents.length > 0) {
			    			response.urgentPatents.forEach(function(data){
			    				urgentResponse.push(data);
			    			});

							$timeout(function() {
								urgentPatentModal(response);
							}, 500);
		    			}


			    		if(response.systemMessages.length > 0) {
			    			response.systemMessages.forEach(function(data){
			    				var dateFrom = data.displayFromDate, dateTo = data.displayToDate;
			    				if(date > dateFrom && date < dateTo) { 
			    					systemResponse.push(data);
			    				}
			    			});

							$timeout(function() {
								systemMessageModal(response);
							}, 500);

			    		}		    			

			    	},
			    	function(errResponse){
			    		console.log(errResponse);
			    	}
		    	);
	    	}

			if(transactions !== undefined && transactions.length > 0) {
				transactions.forEach(function(data){
					var hours =  vm.date - data.lastUpdatedDate;
					var recentTrans  = millsToHours(data, hours);

					if(recentTrans !== undefined) {
						vm.recentTransArr.push(recentTrans);
					}

					if(data.latestTransStatus == 'Completed') {
						if(recentTrans !== undefined) {
							vm.recentRenewalArr.push(data);							
						}
					}
				});	
			}

			//TOTAL RENEWALS PIE CHART

			if(patents.length === 0) {
				vm.totalPatents = 0;
			} else {

				vm.totalPatents = patents.length;
			}

			if(patents) {
				patents.forEach(function(item){
					if(item.renewalStatus !== 'Renewal in place' && item.renewalStatus !== 'Too late to renew' && item.renewalStatus !== 'No renewal needed') {
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
			}


			vm.charts = {

				doughnut: {
					labels: ["No action required", "Black", "Blue", "Red", "Yellow", "Green"],
					data: [vm.greyRenewals.length, vm.blackRenewals.length, vm.blueRenewals.length, vm.redRenewals.length, vm.amberRenewals.length, vm.greenRenewals.length],
					options: {
						elements: {
							arc: {
								borderWidth: 3	
							}
						},
						responsive: true,
						cutoutPercentage: 70,
						animation: {
							duration: 1500,
							easing: 'linear'
						}

				  	},
				  	colours: [{
					      	backgroundColor: '#bdbdbd',
					      	pointBackgroundColor: '#bdbdbd',
					      	pointHoverBackgroundColor: '#bdbdbd',
					     	borderColor: '#bdbdbd',
				      		pointBorderColor: '#bdbdbd',
			      			pointHoverBorderColor: '#bdbdbd'
					    },{
				      		backgroundColor: '#3c3c3b',
				      		pointBackgroundColor: '#3c3c3b',
				      		pointHoverBackgroundColor: '#3c3c3b',
				      		borderColor: '#3c3c3b',
				      		pointBorderColor: '#fff',
				      		pointHoverBorderColor: '#3c3c3b'
					    },{
			      			backgroundColor: '#0097ce',
				      		pointBackgroundColor: '#0097ce',
				      		pointHoverBackgroundColor: '#0097ce',
				      		borderColor: '#0097ce',
				      		pointBorderColor: '#0097ce',
				      		pointHoverBorderColor: '#0097ce'
					    },{
					      	backgroundColor: '#e30613',
					      	pointBackgroundColor: '#e30613',
					      	pointHoverBackgroundColor: '#e30613',
					      	borderColor: '#e30613',
					      	pointBorderColor: '#e30613',
					      	pointHoverBorderColor: '#e30613'
					    },{
					      	backgroundColor: '#f9b233',
					      	pointBackgroundColor: '#f9b233',
					      	pointHoverBackgroundColor: '#f9b233',
					      	borderColor: '#f9b233',
					      	pointBorderColor: '#f9b233',
					      	pointHoverBorderColor: '#f9b233'
					    },{
					      	backgroundColor: '#53ab58',
					      	pointBackgroundColor: '#53ab58',
					      	pointHoverBackgroundColor: '#53ab58',
					      	borderColor: '#53ab58',
					      	pointBorderColor: '#53ab58',
					      	pointHoverBorderColor: '#53ab58'
					    }
					  ]
				} //donught end
			}; //charts end

		}; //$onInit end		

	}
]});
