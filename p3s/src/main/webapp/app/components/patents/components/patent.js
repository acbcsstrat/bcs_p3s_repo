app.component('patent', {
	bindings: { 
		patent: '<',
		graph: '<',
		renewal: '<'
	},
	templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
	controller: ['patentTabService', 'patentsService', '$state', '$timeout','$scope','chartTabService', function(patentTabService, patentsService, $state, $timeout, $scope, chartTabService) {

		var vm = this;



     	//GRAPHS ///////////////



     	vm.$onChanges = function(changeObj){

	            if(changeObj.patent){
	            	var patentLineChart = angular.element(document.getElementById('#patentLineChart"'));
	            	var patentBarChart = angular.element(document.getElementById('#patentBarChart"'));

	            	var caFee = vm.graph.fee;

	            	vm.feeBreakDown = {
	            		renewalFeeEUR: caFee.renewalFeeEUR,
	            		extensionFee: caFee.extensionFeeEUR,
	            		renewalFeeUSD: caFee.renewalFeeUSD,
	            		extensionFeeEur: caFee.extensionFeeEUR,
	            		extensionFeeUSD: caFee.extensionFeeUSD,
	            		processingFeeUSD: caFee.processingFeeUSD,
	            		expressFeeUSD: caFee.expressFeeUSD,
	            		urgentFeeUSD: caFee.urgentFeeUSD,
	            		latePayPenaltyUSD: caFee.latePayPenaltyUSD,
	            		fxRate: caFee.fxRate,
	            		subTotalUSD: caFee.subTotalUSD
	            	}

	            	const caLine = vm.graph.lineChart;
	            	const lineDataArr = [];
	            	const lineLabelArr = [];      

					Object.keys(caLine).forEach(day => {

						const dayData = caLine[day];

						lineLabelArr.push(day);
						lineDataArr.push(dayData.subTotal_USD)

					})

					vm.lineLabels = lineLabelArr;
	             	vm.lineData = lineDataArr;
	     		  	vm.lineSeries = ['Series A', 'Series B'];
				  	vm.lineDatasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
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
				                tension: 0, // disables bezier curves
				                pointStyle: 'cross'
				            }
				        }

				  	};


					const caBar = vm.graph;
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


 			vm.stacked = [{value: 60, type: 'success'}];






	        //NOTIFICATIONS//////////////////

			vm.patentNotifications = {
				green: 'Green',
				yellow: 'Amber',
				red: 'Red',
				blue: 'Blue',
				black: 'Black'
			}

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

	        	vm.chunkedData = chunk(phaseNotifications(phase), 3);

			}            
        }	









        // PATENT INFORMATION //////////////////////

        vm.sortType = 'renewalYear';
        vm.sortReverse = true;

        vm.$onInit = function() {

       

        	var cad =  vm.graph;
        	var greenCost = cad.greenStageCost, yellowCost = cad.amberStageCost, redCost = cad.redStageCost, blueCost = cad.blueStageCost, brownCost = cad.brownStageCost;

   //      	switch (cad.currentcostBand) {
			//     case 'Green':
			//        	vm.stageSavings = eval(yellowCost - greenCost);
			//        	vm.renewBefore = new Date(cad.blueStartDate);
			//         break;
			//     case 1:
			//         day = "Monday";
			//         break;
			//     case 2:
			//         day = "Tuesday";
			//         break;
			//     case 3:
			//         day = "Wednesday";
			//         break;
			//     case 4:
			//         day = "Thursday";
			//         break;
			//     case 5:
			//         day = "Friday";
			//         break;
			//     case 6:
			//         day = "Saturday";
			// }

   //      	if(vm.patent === 'Green') {

   //      	}

	        function usdFxEur() {
	        	var fx = eval(1 * vm.graph.fee.fxRate);
	        	vm.usd2eur = fx;
	        }
         	usdFxEur();
	 	}

       

     	vm.deletePatent = function(id){
	        patentsService.deletePatent(id)
	            .then(function(){
	             	$state.go('patents', {}, {reload: true})
             	.then(function(){
	             		$timeout(function(){patentsService.fetchAllPatents()}, 400);
	             	})
	             },
	            function(errResponse){
	                console.error('Error while deleting Patent');
	            }
	        );
	    }

        vm.updatePatent = function(patent) {
        	var id = patent.id;
        	patentsService.updatePatent(patent, id);
        }

	    vm.editing=[];

	    vm.editItem = function (index) {
	        vm.editing[index] = true;
	    }

	    vm.doneEditing = function (index) {
	        vm.editing[index] = false;
	    };












	    //TABS////////////////////////////






		vm.caTabs = patentTabService.tabs;
		vm.caCurrentTab = patentTabService.currentTab;

	    vm.caOnClickTab = function(currentTab) {
	        patentTabService.onClickTab(currentTab);
	        vm.caCurrentTab = patentTabService.currentTab;
	    };

	    vm.caIsActiveTab = function(tabUrl) {
	        return tabUrl == patentTabService.currentTab;
	    }
	  	
	}]

});