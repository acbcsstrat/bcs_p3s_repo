app.component('dashboard', {
	bindings: { 
		patents: '<',
		transactions: '<' 
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: function($stateParams, $state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http, $rootScope, fxService, patentsRestService, $mdSidenav, patentsService, currentTransactionsService, dashboardService, localStorageService) {

		var vm = this;
		
		$rootScope.page = 'Dashboard';

	    vm.animate = false;


		 //    $state.transitionTo($state.current, $stateParams, {
			//     reload: true,
			//     inherit: false,
			//     notify: true
			// });	    	



	    $timeout(function() {
	      vm.animate = true;
	    }, 100);

		vm.fetchItemRenewal = function() {
			patentsService.activePatentItemMenu();
		}

		vm.fetchItemTransaction = function(id) {
			currentTransactionsService.fetchCurrentTransactions()
			.then(
				function(response) {
					response.forEach(function(data) {

						const transId = data.id;
						
						data.renewalUIs.forEach(function(data, i) {
							if(data.patentUI.id == id) {
								$state.go('current-transactions.current-transaction-item',{transId: transId})
							}
						})

					})
				},
				function(errResponse) {
					console.log(errResponse)
				}
			)
		}

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
		]

		vm.activeMenu = vm.activityNotifications[0].activity;

		vm.setActivityActiveTab = function(menuItem, index) {
			$scope.activeActivityTabResp = index;
			vm.activeMenu = menuItem
		}

		vm.fxPeriodActive = function(fxActive) {
			switch(fxActive) {
				case 0:
					vm.renewalfxTimeframe = 'Today';
				break;
				case 1:
					vm.renewalfxTimeframe = 'Yesterday'
				break;
				case 2:
					vm.renewalfxTimeframe = 'Last Week'
				break;
				case 3:
					vm.renewalfxTimeframe = 'Last Mth'													
			}				
		}

		vm.$onInit = () => {

			var loginCounter;

		 	$scope.toggleLeft = buildToggler('left');
    		$scope.toggleRight = buildToggler('right');

		    function buildToggler(componentId) {
		      	return function() {
		        	$mdSidenav(componentId).toggle();
		      	};
		    }

			$scope.counter = localStorageService.get('counter');

		    if($scope.counter === null) {

		    	localStorageService.set('counter', 1);

		    	$scope.counter = localStorageService.get('counter');

		    	dashboardService.getMessages()
			    .then(
			    	function(response){
			    		console.log(response)
			    		var systemResponse = [];
			    		var urgetResponse = [];
			    		
			    		var date = new Date().getTime();

			    		if(response.systemMessages.length > 0) {

			    			response.systemMessages.forEach(function(data){
			    				var dateFrom = data.displayFromDate; dateTo = data.displayToDate;
			    				if(date > dateFrom && date < dateTo) { 
			    					systemResponse.push(data)
			    				}
			    			})

							function systemMessageModal() {

								var modalInstance = $uibModal.open({
									templateUrl: 'p3sweb/app/components/dashboard/views/modals/system-message-modal.htm',
									scope: $scope,
									appendTo: undefined,
									controllerAs: vm,
									controller: function($uibModalInstance, message) {

										open = true;

										vm.systemMessage = message;

								 	  	vm.ok = function () {
									    	$uibModalInstance.close();
									  	};

									},
									resolve: {
										message: function() {
											return systemResponse;
										}
									}
								});

							 	modalInstance.result.finally(function () {
							     	
							     	if(response.urgentPatents.length == 0) {
							     		return;
							     	} else {

							     		
							
							     		open = false;

							     		response.urgentPatents.forEach(function(data){
					    					urgetResponse.push(data)
						    			})
							     		
							     		$timeout(function() {
											var modalInstance = $uibModal.open({
												templateUrl: 'p3sweb/app/components/dashboard/views/modals/urgent-message-modal.htm',
												scope: $scope,
												appendTo: undefined,
												controllerAs: vm,
												controller: function($uibModalInstance, message) {

													vm.urgetMessage = message;

											 	  	vm.ok = function () {
												    	$uibModalInstance.close();
												  	};

												  	

												},
												resolve: {
													message: function() {
														return urgetResponse;
													}
												}
											});
							     		}, 200);
							     	}
							     		
						     	})
							}; //function end

							$timeout(function() {
								systemMessageModal()	
							}, 1000);

			    		} //if end

			    	},
			    	function(){

			    	}
		    	)
	    	}

      		$scope.date = new Date()
	      	
			var transactions = vm.transactions;
			var patents = vm.patents;

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

			vm.recentTransArr = [];
			vm.recentStageArr = [];
			vm.recentRenewalArr = [];

			if(transactions !== undefined && transactions.length > 0) {
				transactions.forEach(function(data){
					
					var d = new Date().getTime();
					var hours =  d - data.lastUpdatedDate;
					var recentTrans  = millsToHours(data, hours);

					if(recentTrans !== undefined) {
						vm.recentTransArr.push(recentTrans)
					}

					if(data.latestTransStatus === 'Completed') {
						vm.recentRenewalArr.push(data)
					}
				})				
			}


			patentsRestService.fetchAllPatents()
				.then(
					function(patents){

						var d = new Date().getTime();

						patents.forEach(function(item){
							patentsRestService.fetchCostAnalysis(item.id)
			                .then(
			                    function(response){


			                        switch(item.costBandColour) {
			                            case 'Green':

			                            //stage change

				                    	var hours =  d - response.greenStartDate;

				                    	if(millsToHours(response, hours) !== undefined){
				                    		vm.recentStageArr.push(item)
				                    		item.nextCostBandColor = 'Amber';
				                    	}

				                    	//progress

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

			                            //stage change

				                    	var hours =  d - response.amberStartDate;

				                    	if(millsToHours(response, hours) !== undefined){
				                    		vm.recentStageArr.push(item);
				                    		item.nextCostBandColor = 'Red';
				                    	}

				                    	//progress

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

			                            //recent stage

				                    	var hours =  d - response.redStartDate;

				                    	if(millsToHours(item, hours) !== undefined){
				                    		vm.recentStageArr.push(item)
				                    		item.nextCostBandColor = 'Blue';
				                    	}

				                    	//progress

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

				                    	var hours =  d - response.blueStartDate;

				                    	if(millsToHours(response, hours) !== undefined){
				                    		vm.recentStageArr.push(item)
				                    		item.nextCostBandColor = 'Black';
				                    	}

			                            //progress

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

			                            //progress

				                    	var hours =  d - response.blackStartDate;

				                    	if(millsToHours(response, hours) !== undefined) {
				                    		vm.recentStageArr.push(item);
											item.nextCostBandColor = 'Grey';				                    		
				                    	}

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


			vm.greenRenewals = [];
			vm.amberRenewals = [];
			vm.redRenewals = [];
			vm.blueRenewals = [];
			vm.blackRenewals = [];
			vm.greyRenewals = [];

			//COLOUR KEY

			vm.selectedPhase;

			vm.colourKey = function(colour) {
				switch(colour) {
					case 0:
						vm.colourPhaseTitle = {
							title: 'Green',
							descrip: '3 months before renewal date - 6 working days before renewal date',
							color: '#53ab58'
						}
					break;
					case 1:
						vm.colourPhaseTitle = {
							title: 'Amber',
							descrip: '6 working days before renewal date - 3 working days before renewal date',
							color: '#f9b233'						
						}
					break;
					case 2:
						vm.colourPhaseTitle = {
							title: 'Red',
							descrip: '3 working days before renewal date - End of renewal date',
							color: '#e30613'
						}
					break;
					case 3:
						vm.colourPhaseTitle = {
							title: 'Blue',
							descrip: 'Day after renewal date - 10 working days before end of extension',
							color: '#0097ce'					
						}
					break;
					case 4:
						vm.colourPhaseTitle = {
							title: 'Black',
							descrip: '10 working days before the expiry of the extension period, and runs until the end of the 6th day before the end of the extension period.',
							color: '#3c3c3b'
						}
					break;
					case 5:
						vm.colourPhaseTitle = {
							title: 'Grey',
							descrip: 'herisuhimassss',
							color: '#bdbdbd'
						}						
				}
			}

			//TOTAL RENEWALS PIE CHART

			vm.totalPatents = patents.length;

			patents.forEach(function(item){
				if(item.renewalStatus !== ('Renewal in place' || 'Too late to renew')) {
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
					}
				} else {
					vm.greyRenewals.push(item)
				}

				vm.doughnutLabels = ["No action required", "Black", "Blue", "Red", "Yellow", "Green"];
				vm.doughnutColours = ['#bdbdbd', '#3c3c3b','#0097ce', '#e30613', '#f9b233','#53ab58'];
			 	$timeout(function () {
			 		vm.doughnutData = [vm.greyRenewals.length, vm.blackRenewals.length, vm.blueRenewals.length, vm.redRenewals.length, vm.amberRenewals.length, vm.greenRenewals.length];
			 	}, 500)
				
				vm.doughnutOptions = {
					elements: {
						arc: {
							borderWidth: 2	
						}
					},
					responsive: true,
					cutoutPercentage: 70,
					animation: {
						duration: 1500,
						easing: 'linear'
					}
			  	};

			  	vm.doughnutHover = function(chartArr, mouseEvent, chart) {
			  		
			  		
			  		
			  		// if(chartArr.length !== 0) {
			  		// 	console.log(chartArr[0])
			  		// }

			  		if(chart !== undefined) {
			  			ctx = chart._chart.ctx;
			  			console.log(ctx)
			  			ctx.canvas.onmouseenter = function(evt) {
			  				console.log(window);
			  			}
			  			ctx.canvasshadowColor = 'red';
			  			// console.log(ctx)
			  		}

			  		if(mouseEvent && chart !== undefined) {
			  			console.log('mouseEvent:', mouseEvent)
			  		}


			  		
			  	}

			  	// console.log(Chart.defaults.doughnut.hover)

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
					break;			

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
						if(fees !== null) {
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
						} //if

					} //function end
	        		patentFx($scope.currentIndex)
		        },
		    	init: function(event, slick, currentSlide, nextSlide) {
		    		slick.slickGoTo($scope.currentIndex);
		    	}
		    }
		};

		

	}
})
