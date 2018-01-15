app.component('dashboard', {
	bindings: { 
		patents: '<',
		transactions: '<'
	},
	templateUrl: 'p3sweb/app/components/dashboard/views/dashboard.htm',
	controller: ['$state', '$scope', '$uibModal', '$timeout', '$http', '$rootScope', 'fxService', 'patentsRestService', 'patentsService', 'currentTransactionsService', 'dashboardService', 'localStorageService', function($state, $scope, $uibModal, $timeout, $http, $rootScope, fxService, patentsRestService, patentsService, currentTransactionsService, dashboardService, localStorageService) {

		var vm = this;
		
		$rootScope.page = 'Dashboard';

	    vm.animate = false;

	    vm.date = new Date().getTime();

	    $timeout(function() {
	      vm.animate = true;
	    }, 100);

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

		function calcProgress(start, end) {

			var today = new Date().getTime();

			var total = end - start;
			var progress = today - start;
			
			return Math.round(((progress) / (total)) * 100);

		}	

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
			vm.activeActivityTabResp = index;
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

		//suppresing system messages

		var messageObj = {};
		var messageArr = [];

		vm.checkedMessages = function(id, checked) {

			if(checked) {
				messageArr.push(id)
				vm.message = true;
			} else {
				messageArr.splice(-1, 1)
			}

			if(messageArr.length == 0) {
				vm.message = false;				
			}

		}

		messageObj.messageArr = messageArr;

		vm.supresssMessages = function() {
			dashboardService.supressMessages(messageObj)
		}

		function patentCostAnalysisFn(id) {
			patentsRestService.fetchCostAnalysis(id)
			.then(
				function(response){
                    switch(response.currentcostBand) {
                        case 'Green':
                        
                    	var hours =  vm.date - response.greenStartDate;

                    	if(millsToHours(response, hours) !== undefined){
                    		vm.recentStageArr.push(item)
                    		item.nextCostBandColor = 'Amber';
                    	}

						vm.greenRenewals.forEach(function(data){
							data.progressBar = calcProgress(response.greenStartDate, response.amberStartDate);
						})

						break;
						case 'Amber':

                    	var hours =  vm.date - response.amberStartDate;

                    	if(millsToHours(response, hours) !== undefined){
                    		vm.recentStageArr.push(item)
                    		item.nextCostBandColor = 'Red';
                    	}

                    	//progress
						vm.greenRenewals.forEach(function(data){
							data.progressBar = calcProgress(response.amberStartDate, response.redStartDate);
						})						

					}
				},
				function(errResponse) {
					// body...
				}
			)
		}

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
	        		vm.currIndexForTitle = (currentSlide + 1);

	        		function patentFx(i) {

	        			vm.selectedPatent = vm.phaseArr[i];

	        			patentCostAnalysisFn(vm.selectedPatent.id) 

						var fees = vm.phaseArr[i].feeUI;
						if(fees !== null) {
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

					        			var week = 7;
					        			var date = new Date()
					        			var lwD = new Date(date.getTime() - (week * 24 * 60 * 60 * 1000))
					        			var lastWeekD = new Date(lwD).getDay();
					        			var lastWeekDt = new Date(lwD).getDate();

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

					        			var tD = new Date();
					        			var lmD = tD.setMonth(tD.getMonth() - 1);
					        			var lastMonthD = new Date(lmD).getDay();
					        			var lastMonthDt = new Date(lmD).getDate();
					        			dateArr.forEach(function(item, index){
					        				if((new Date(item).getDay() == lastMonthD) && (new Date(item).getDate() == lastMonthDt)) {
					        					var lastMonthFx = data[index].rate;
					        					vm.lastMonthsPriceUSD = Math.floor(fees.subTotalEUR * lastMonthFx);
					        					vm.lastMonthsPriceEUR = Math.floor(fees.subTotalEUR);
					        				}
					        			})

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

		vm.$onInit = () => {

			var loginCounter;

			var counter = localStorageService.get('counter');

			var transactions = vm.transactions;
			var patents = vm.patents;

			var patentsArr = [];

			vm.recentTransArr = [];
			vm.recentStageArr = [];
			vm.recentRenewalArr = [];

			vm.greenRenewals = [];
			vm.amberRenewals = [];
			vm.redRenewals = [];
			vm.blueRenewals = [];
			vm.blackRenewals = [];
			vm.greyRenewals = [];
	
		    if(counter == null) {

		    	localStorageService.set('counter', 1);

		    	counter = localStorageService.get('counter');

		    	dashboardService.getMessages()
			    .then(
			    	function(response){

			    		var systemResponse = [];
			    		var urgentResponse = [];
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

									  	vm.dismissModal = function() {
									  		$uibModalInstance.dismiss();
									  	}									  	

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
					    					urgentResponse.push(data)
						    			})
							     		
							     		$timeout(function() {
											var modalInstance = $uibModal.open({
												templateUrl: 'p3sweb/app/components/dashboard/views/modals/urgent-message-modal.htm',
												scope: $scope,
												appendTo: undefined,
												controllerAs: vm,
												controller: function($uibModalInstance, message) {

													vm.urgentMessage = message;

											 	  	vm.ok = function () {
												    	$uibModalInstance.close();
												  	};

												  	vm.dismissModal = function() {
												  		console.log('dismiss')
												  		$uibModalInstance.dismiss();
												  	}
												},
												resolve: {
													message: function() {
														return urgentResponse;
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
			    	function(errResponse){
			    		console.log(errResponse)
			    	}
		    	)
	    	}
	      	


			if(transactions !== undefined && transactions.length > 0) {
				transactions.forEach(function(data){
					var hours =  vm.date - data.lastUpdatedDate;
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
				function(response){
					response.forEach(function(item){
						patentsArr.push(item)
					})
				},
				function(errResponse) {
					console.log(errResponse)
				}
			)
						
			//COLOUR KEY

			vm.colourKey = function(colour) {
				switch(colour) {
					case 0:
						vm.colourPhaseTitle = {
							title: 'Green',
							color: '#53ab58'
						}
					break;
					case 1:
						vm.colourPhaseTitle = {
							title: 'Amber',
							color: '#f9b233'						
						}
					break;
					case 2:
						vm.colourPhaseTitle = {
							title: 'Red',
							color: '#e30613'
						}
					break;
					case 3:
						vm.colourPhaseTitle = {
							title: 'Blue',
							color: '#0097ce'					
						}
					break;
					case 4:
						vm.colourPhaseTitle = {
							title: 'Black',
							color: '#3c3c3b'
						}
					break;
					case 5:
						vm.colourPhaseTitle = {
							title: 'Grey',
							color: '#bdbdbd'
						}						
				}
			}

			//TOTAL RENEWALS PIE CHART

			vm.totalPatents = patents.length;

			if(patents) {
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
				})				
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
			} //charts end
			
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

	}
]})
