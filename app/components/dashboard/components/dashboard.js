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

		// var messageObj = {};
		// var messageArr = [];

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
	                // dispatch: {
	                //     stateChange: function(e){ console.log("stateChange"); },
	                //     changeState: function(e){ console.log("changeState"); },
	                //     tooltipShow: function(e){ console.log("tooltipShow"); },
	                //     tooltipHide: function(e){ console.log("tooltipHide"); }
	                // },
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

			vm.lineData = chartDatafn();

            vm.xAxisTickFormat = function(){
                return function(d){
//                    return d3.time.format('%X')(new Date(d));  //uncomment for time format
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

  	   //  	$scope.$on('$viewContentLoaded', function(){
		    //   $timeout(function(){
		    //     $scope.pieChart.api.refresh();
		    //   },100);
		    // });


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
	                      switch(e.data.key) {
	                      	case 'green':
	                      		vm.phaseObj.colourKey(0);
	                      		$scope.activeTab = 0;
	                      	break;
	                      	case 'amber':
	                      		vm.phaseObj.colourKey(1);
	                      		$scope.activeTab = 1;
	                      	break;
	                      	case 'red':
	                      		vm.phaseObj.colourKey(2);
	                      		$scope.activeTab = 2;
	                      	break;
	                      	case 'blue':
	                      		vm.phaseObj.colourKey(3);
	                      		$scope.activeTab = 3;
	                      	break;
	                      	case 'black':
	                      		vm.phaseObj.colourKey(4);
	                      		$scope.activeTab = 4;
	                      	break;
	                      	case 'grey':
	                      		vm.phaseObj.colourKey(5);
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


		function millsToHours(millisec) {

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
	            return true;
	        }

	    }

		// messageObj.messageArr = messageArr;

		// vm.supresssMessages = function() {
		// 	dashboardService.supressMessages(messageObj);
		// };

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
		        					vm.todaysPriceUSD = parseFloat(fees.subTotalEUR * todaysFx).toFixed(2);
		        					vm.todaysPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
		        				}
		        				// console.log(vm.todaysPriceUSD, dateArr, data)
		        				//yesterday
		        				// if(item == dateArr[1]) {
		        				 if(item == dateArr[1]) {	
		        					var yesterdayFx = data[index].rate;
		        					vm.yesterdaysPriceUSD = parseFloat(fees.subTotalEUR * yesterdayFx).toFixed(2);
		        					vm.yesterdaysPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
		        				}
		        				//weekly
		        				if(item == dateArr[7]) { 
		        					var lastWeekFx = data[index].rate;
		        					vm.lastWeeksPriceUSD = parseFloat(fees.subTotalEUR * lastWeekFx).toFixed(2);
		        					vm.lastWeeksPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
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
		        					vm.lastMonthsPriceUSD = parseFloat(fees.subTotalEUR * lastMonthFx).toFixed(2);
		        					vm.lastMonthsPriceEUR = parseFloat(fees.subTotalEUR).toFixed(2);
		        				}
		        			});

		        			$timeout(function() {
		        				var fwSaving = parseFloat(vm.todaysPriceUSD - vm.lastMonthsPriceUSD).toFixed(2);
		        				if(fwSaving < 0) {
		        					vm.variationSave = true;
		        					vm.fourWeekVariation = fwSaving.toString().replace('-', '');
		        				} else {
		        					vm.variationSave = false;
		        					vm.fourWeekVariation = fwSaving;
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
					    	accessibility: false,
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
					    	accessibility: false,
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
					    	accessibility: false,
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
							accessibility: false,
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
					    	accessibility: false,
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

		vm.recentStageArr = [];

		function recentRenewalFn(item, millisec) {

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
	            vm.recentStageArr.push(item);
	        }

	    }

		function patentCostAnalysisFn(id) {
			patentsRestService.fetchCostAnalysis(id)
			.then(
				function(response, i){
                    switch(response.currentcostBand) {
                        case 'Green':

	                    	hours =  vm.date - response.greenStartDate;

                    		patentsArr.forEach(function(item, i) {
                    			if(item.costBandColour == 'Green' && item.renewalStatus == 'Show price') {

                    				if(item.id == id) {
                    					recentRenewalFn(item, hours)
                    				}
                    				item.nextCostBandColor = 'Black';
                    			}
                    		})

						break;
						case 'Amber':

	                    	hours =  vm.date - response.amberStartDate;

                    		patentsArr.forEach(function(item, i) {
                    			if(item.costBandColour == 'Amber' && item.renewalStatus == 'Show price') {
                    				if(item.id == id) {
                    					recentRenewalFn(item, hours)
                    				}
                    				item.nextCostBandColor = 'Black';
                    			}
                    		})

						break;
						case 'Red':

							hours =  vm.date - response.redStartDate;

                    		patentsArr.forEach(function(item, i) {
                    			if(item.costBandColour == 'Red' && item.renewalStatus == 'Show price') {
                    				if(item.id == id) {
                    					recentRenewalFn(item, hours)
                    				}
                    				item.nextCostBandColor = 'Black';
                    			}
                    		})

						break;
						case 'Blue':

							var hours =  vm.date - response.blueStartDate;

                    		patentsArr.forEach(function(item, i) {
                    			if(item.costBandColour == 'Blue' && item.renewalStatus == 'Show price') {
                    				if(item.id == id) {
                    					recentRenewalFn(item, hours)
                    				}
                    				item.nextCostBandColor = 'Black';
                    			}
                    		})
	                    	
						break;
						case 'Black':

							hours =  vm.date - response.blackStartDate;

                    		patentsArr.forEach(function(item, i) {
                    			if(item.costBandColour == 'Black' && item.renewalStatus == 'Show price') {
                    				if(item.id == id) {
                    					recentRenewalFn(item, hours)
                    				}
                    				item.nextCostBandColor = '[Renewal Lapsed]';
                    			}
                    		})

					}
				},
				function(errResponse) {
					// body...
				}
			);
		}

		
		$scope.currentIndex = 0;

		//COLOUR KEY	


		vm.$onInit = function() {

			var counter = localStorageService.get('counter');

			var currTrans = vm.currTrans;
			var transHistory = vm.transHistory;
			var patents = vm.patents;
 
 			$timeout(function() {
 				if(patents) {
					patents.forEach(function(item){
						patentCostAnalysisFn(item.id);
					}) 					
 				}
 			}, 300)

 			
			// function welcomeMessageModal() {
			// 	var modalInstance = $uibModal.open({
			// 		templateUrl: 'p3sweb/app/components/dashboard/views/modals/welcome-message-modal.htm',
			// 		scope: $scope,
			// 		controllerAs: vm,
			// 		controller: function($uibModalInstance) {

			// 	 	  	vm.dismissWelcomeModal = function () {
			// 		    	$uibModalInstance.close();
			// 		  	};
			// 		}
			// 	});
		 // 	} //function systemMessageModal

			// function urgentPatentModal(response) {
			// 	var modalInstance = $uibModal.open({
			// 		templateUrl: 'p3sweb/app/components/dashboard/views/modals/urgent-message-modal.htm',
			// 		scope: $scope,
			// 		controllerAs: vm,
			// 		controller: function($uibModalInstance, message) {

			// 			vm.urgentPatents = message;

			// 	 	  	vm.urgentOk = function () {
			// 		    	$uibModalInstance.close();
			// 		  	};

			// 		  	vm.urgentDismissModal = function() {
			// 		  		$uibModalInstance.dismiss();
			// 		  	};

			// 		},
			// 		resolve: {
			// 			message: function() {
			// 				return urgentResponse;
			// 			}
			// 		}
			// 	});
		 // 	} //function urgentPatentModal		 	


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


			    // 		if(response.systemMessages.length > 0) {
			    // 			response.systemMessages.forEach(function(data){
			    // 				var dateFrom = data.displayFromDate, dateTo = data.displayToDate;
			    // 				if(date > dateFrom && date < dateTo) { 
			    // 					systemResponse.push(data);
			    // 				}
			    // 			});

							// $timeout(function() {
							// 	systemMessageModal(response);
							// }, 500);

			    // 		}		    			

			    	},
			    	function(errResponse){
			    		console.log(errResponse);
			    	}
		    	);
	    	}

			currTrans.forEach(function(data){
	
				var hours =  vm.date - data.lastUpdatedDate;
				var recentTrans  = millsToHours(hours);

				if(recentTrans) {
					vm.recentTransArr.push(data);
				}

				if(recentTrans && data.latestTransStatus === 'Completed') {
					vm.recentRenewalArr.push(data);
				}
			});	
		

			//TOTAL RENEWALS PIE CHART

			if(patents.length === 0) {
				vm.totalPatents = 0;
			} else {

				vm.totalPatents = patents.length;
			}

			if(patents) {
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
			}


			// vm.charts = {

			// 	doughnut: {
			// 		labels: ["No action required", "Black", "Blue", "Red", "Yellow", "Green"],
			// 		data: [vm.greyRenewals.length, vm.blackRenewals.length, vm.blueRenewals.length, vm.redRenewals.length, vm.amberRenewals.length, vm.greenRenewals.length],
			// 		options: {
			// 			elements: {
			// 				arc: {
			// 					borderWidth: 3	
			// 				}
			// 			},
			// 			responsive: true,
			// 			cutoutPercentage: 70,
			// 			animation: {
			// 				duration: 1500,
			// 				easing: 'linear'
			// 			}

			// 	  	},
			// 	  	colours: [{
			// 		      	backgroundColor: '#bdbdbd',
			// 		      	pointBackgroundColor: '#bdbdbd',
			// 		      	pointHoverBackgroundColor: '#bdbdbd',
			// 		     	borderColor: '#bdbdbd',
			// 	      		pointBorderColor: '#bdbdbd',
			//       			pointHoverBorderColor: '#bdbdbd'
			// 		    },{
			// 	      		backgroundColor: '#3c3c3b',
			// 	      		pointBackgroundColor: '#3c3c3b',
			// 	      		pointHoverBackgroundColor: '#3c3c3b',
			// 	      		borderColor: '#3c3c3b',
			// 	      		pointBorderColor: '#fff',
			// 	      		pointHoverBorderColor: '#3c3c3b'
			// 		    },{
			//       			backgroundColor: '#0097ce',
			// 	      		pointBackgroundColor: '#0097ce',
			// 	      		pointHoverBackgroundColor: '#0097ce',
			// 	      		borderColor: '#0097ce',
			// 	      		pointBorderColor: '#0097ce',
			// 	      		pointHoverBorderColor: '#0097ce'
			// 		    },{
			// 		      	backgroundColor: '#e30613',
			// 		      	pointBackgroundColor: '#e30613',
			// 		      	pointHoverBackgroundColor: '#e30613',
			// 		      	borderColor: '#e30613',
			// 		      	pointBorderColor: '#e30613',
			// 		      	pointHoverBorderColor: '#e30613'
			// 		    },{
			// 		      	backgroundColor: '#f9b233',
			// 		      	pointBackgroundColor: '#f9b233',
			// 		      	pointHoverBackgroundColor: '#f9b233',
			// 		      	borderColor: '#f9b233',
			// 		      	pointBorderColor: '#f9b233',
			// 		      	pointHoverBorderColor: '#f9b233'
			// 		    },{
			// 		      	backgroundColor: '#53ab58',
			// 		      	pointBackgroundColor: '#53ab58',
			// 		      	pointHoverBackgroundColor: '#53ab58',
			// 		      	borderColor: '#53ab58',
			// 		      	pointBorderColor: '#53ab58',
			// 		      	pointHoverBorderColor: '#53ab58'
			// 		    }
			// 		  ]
			// 	} //donught end
			// }; //charts end

		}; //$onInit end		

	}
]});
