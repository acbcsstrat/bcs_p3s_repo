app.component('patent', {
	bindings: { 
		patent: '<',
		costAnalysis: '<',
		renewal: '<'
	},
	templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
	controller: ['patentsRestService', '$state', '$timeout','$scope', 'fxService',  function(patentsRestService, $state, $timeout, $scope, fxService) {

		var vm = this;
		
		vm.activePatentItemMenu = 'Patent Info';
		vm.chartActive = 'Stage Cost Chart';

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
						title: 'Amber',
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

     	vm.$onChanges = function(changeObj){

	            if(changeObj.patent){

	            	var patentLineChart = angular.element(document.getElementById('#patentLineChart"'));
	            	var patentBarChart = angular.element(document.getElementById('#patentBarChart"'));

					var patent = vm.patent;
	            	var caFee = vm.costAnalysis.fee;
	            	var costBand = vm.costAnalysis;
		            var renewalHistory = vm.renewal;
			
	            	vm.feeBreakDown = {
	            		renewalFeeEUR: caFee.renewalFeeEUR,
	            		renewalFeeUSD: caFee.renewalFeeUSD,
	            		extensionFee: caFee.extensionFeeEUR,
	            		renewalFeeUSD: caFee.renewalFeeUSD,
	            		extensionFeeEur: caFee.extensionFeeEUR,
	            		extensionFeeUSD: caFee.extensionFeeUSD,
	            		processingFeeEUR: caFee.processingFeeEUR,
	            		processingFeeUSD: caFee.processingFeeUSD,
	            		expressFeeUSD: caFee.expressFeeUSD,
	            		urgentFeeUSD: caFee.urgentFeeUSD,
	            		latePayPenaltyUSD: caFee.latePayPenaltyUSD,
	            		fxRate: caFee.fxRate,
	            		subTotalEUR: caFee.subTotalEUR,
	            		subTotalUSD: caFee.subTotalUSD,
	            		bandSaving: function() {
	            			var item = {};
	            			switch(patent.costBandColour) {
	            				case 'Green':
	            					item.savings =  Math.round(costBand.amberStageCost - costBand.greenStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Amber':
	            					item.savings =  Math.round(costBand.redStageCost - costBand.amberStageCost)
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Red':
	            					item.savings =  Math.round(costBand.blueStageCost - costBand.redStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Blue':
	            					item.savings =  Math.round(costBand.blackStageCost - costBand.blueStageCost);
	            					item.renewBefore = patent.costBandEndDate;
	            				break;
	            				case 'Black':
	            					item.savings =  'N/A';
	            					item.renewBefore = 'N/A'

	            			}
	            			return item;
	            		}
	            	}

	            	const caLine = vm.costAnalysis.lineChart;
	            	const lineDataArr = [];
	            	const lineLabelArr = [];
					Object.keys(caLine).forEach(day => {
						console.log(day)
						const dayData = caLine[day];
						lineLabelArr.push(day.slice(4, 10));
						lineDataArr.push(dayData.subTotal_USD)
					})

					vm.barChartColours = ['#3c3c3b','#0097ce', '#e30613', '#f9b233','#53ab58'];

					vm.lineLabels = lineLabelArr;

	             	vm.lineData = lineDataArr;
	     		  	vm.lineSeries = ['Series A', 'Series B'];
				  	vm.lineDatasetOverride = [
				  		{ yAxisID: 'y-axis-1' }, 
				  		{ yAxisID: 'y-axis-2' },
				  		];
				  	vm.lineOptions = {
				    	scales: {
				      		yAxes: [
					        	{
						          id: 'y-axis-1',
						          type: 'linear',
						          display: true,
						          position: 'left'
						        }
					      	]
					    },
			     		elements: {
				            line: {
				            	borderColor: '#c6c6c6',
				            	borderWidth: 2,
				            	width: '10',
				            	fill: null,
				                tension: 0, // disables bezier curves
				                pointStyle: 'cross'
				            }
				        }

				  	};


					const caBar = vm.costAnalysis;
					const barDataArr = [];
					const barLabelArr = [];

					Object.keys(caBar).forEach(data => {

						const dayData = caBar[data];

						if (data.includes('UI')) {
							barLabelArr.push(dayData);
						}

						if (data.includes('StageCost')) {
							barDataArr.push(dayData);
						}
					})

				  	vm.barLabels = barLabelArr.slice(0, 5).sort(function(a, b){return b-a});
				  	vm.barData = barDataArr.slice(0, 5).sort(function(a, b){return b-a});
					vm.barSeries = ['Series A', 'Series B'];
					vm.barOptions = {
		                scaleShowGridLines: false,
			            barShowStroke : false,
			            barDatasetSpacing : 0
				  	};

	            }



            //PROGRESS BAR
            $timeout(function() {
            	vm.progressBar = vm.patent.progressBar
            }, 200);
 			

	        vm.nextStage = function() {
        		var nextStage;
        		switch(vm.patent.costBandColour) {
        			case 'Green':
        				nextStage = 'Amber'
        			break;
        			case 'Amber':
        				nextStage = 'Red'
        			break;
        			case 'Red':
        				nextStage = 'Blue'
        			break;
        			case 'Blue':
        				nextStage = 'Black'
        			break;
        			case 'Black':
        				nextStage = 'End'   			
        		}
        		return nextStage;
        	}




	        //NOTIFICATIONS//////////////////

			vm.patentNotifications = {
				green: 'Green',
				amber: 'Amber',
				red: 'Red',
				blue: 'Blue',
				black: 'Black'
			}

			vm.colourPhase = 'Green';

			vm.displayNotifications = function(phase) {
	

				function phaseNotifications(phase) {
			  		var notificationsArr = changeObj.patent.currentValue.notificationUIs;
			  		var notifications = [];
		  			
			  		notificationsArr.forEach(function(data){
			  			if(data.costbandcolor == phase) {
			  				notifications.push(data)
			  			}
			  		})

			  		return notifications;

			  	}

	        	var newArr = [];

	        	function chunk(arr, size) {
	        		for (i=0; i < arr.length; i+=size) {
		        		newArr.push(arr.slice(i, i+size));
		        	}
		        	return newArr;
	        	}       	

	        	vm.chunkedData = chunk(phaseNotifications(phase), 8);

			}

        	var cad =  vm.costAnalysis;
        	var greenCost = cad.greenStageCost, amberCost = cad.amberStageCost, redCost = cad.redStageCost, blueCost = cad.blueStageCost, brownCost = cad.brownStageCost;

        	var fxHistory = {}

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

        			dateArr.forEach(function(item, index){
        				//yesterday
        				if(item == dateArr[0]) {
        					var yesterdayFx = data[index].rate;
        					vm.yesterdaysPrice = Math.floor(vm.costAnalysis.fee.subTotalEUR * yesterdayFx);
        				}
        				//weekly
        				if((new Date(item).getDay() == lastWeekD)) {
        					var lastWeekFx = data[index].rate;
        					vm.lastWeeksPrice = Math.floor(vm.costAnalysis.fee.subTotalEUR * lastWeekFx);
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
        					vm.lastMonthsPrice = Math.floor(vm.costAnalysis.fee.subTotalEUR * lastMonthFx);
        				}
        			})
        		},
        		function(error){

        		}
    		)

	        function usdFxEur() {
	        	var fx = eval(1 * vm.costAnalysis.fee.fxRate);
	        	vm.usd2eur = fx;
	        }
         	usdFxEur();


        }	









        // PATENT INFORMATION //////////////////////



        vm.sortType = 'renewalYear';
        vm.sortReverse = true;       

     	vm.deletePatent = function(id){
	        patentsRestService.deletePatent(id)
	            .then(function(){
	             	$state.go('patents', {}, {reload: true})
             	.then(function(){
	             		$timeout(function(){patentsRestService.fetchAllPatents()}, 400);
	             	})
	             },
	            function(errResponse){
	                console.error('Error while deleting Patent');
	            }
	        );
	    }

        vm.updatePatent = function(patent) {
        	var id = patent.id;
        	patentsRestService.updatePatent(patent, id);
        }

	    vm.editing=[];

	    vm.editItem = function (index) {
	        vm.editing[index] = true;
	    }

	    vm.doneEditing = function (index) {
	        vm.editing[index] = false;
	    };

		$timeout(function() {
			vm.colourKey(0);
			vm.displayNotifications(vm.patentNotifications.green)
		}, 100);

	  	
	}]

});