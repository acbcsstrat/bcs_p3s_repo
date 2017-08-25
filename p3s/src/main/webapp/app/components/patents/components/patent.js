app.component('patent', {
	bindings: { 
		patent: '<',
		graph: '<',
		renewal: '<'
	},
	templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
	// controllerAs: 'graphDataController', this can be 
	controller: ['patentTabService', 'patentsService', '$state', '$timeout',function(patentTabService, patentsService, $state, $timeout) {
		var vm = this;

	  	vm.tabs = patentTabService.tabs;
		vm.currentTab = patentTabService.currentTab;

	    vm.onClickTab = function(currentTab) {
	        patentTabService.onClickTab(currentTab);
	        vm.currentTab = patentTabService.currentTab;
	    };

	    vm.isActiveTab = function(tabUrl) {
	        return tabUrl == patentTabService.currentTab;
	    }

     	vm.selectedPatent = vm.patentItem;


     	//========== graphs

     	vm.$onChanges = function(changeObj){

	            if(changeObj.patent){

	            	var patentLineChart = angular.element(document.getElementById('#patentLineChart"'));
	            	var patentBarChart = angular.element(document.getElementById('#patentBarChart"'));

	            	var caFee = vm.graph.fee;

	            	vm.feeBreakDown = {
	            		renewalFeeEUR: caFee.renewalFee_EUR,
	            		extensionFee: caFee.extensionFee_EUR,
	            		renewalFeeUSD: caFee.renewalFee_USD,
	            		extensionFeeEur: caFee.extensionFee_EUR,
	            		extensionFeeUSD: caFee.extensionFee_USD,
	            		processingFeeUSD: caFee.processingFee_USD,
	            		expressFeeUSD: caFee.expressFee_USD,
	            		urgentFeeUSD: caFee.urgentFee_USD,
	            		latePayPenaltyUSD: caFee.latePayPenalty_USD,
	            		fxRate: caFee.fxRate,
	            		subTotal_USD: caFee.subTotal_USD
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
							dayData.slice()
							barLabelArr.push(dayData);
						}

						if (data.includes('StageCost')) {
							barDataArr.push(dayData);
						}

					})

				  	vm.barLabels = barLabelArr;
				  	vm.barData = barDataArr;
					vm.barSeries = ['Series A', 'Series B'];
					vm.barOptions = {
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
		                scaleShowGridLines: false,
			            barShowStroke : false,
			            barDatasetSpacing : 0
					    
				  	};

	            }

            var checkBoxes = changeObj.patent.currentValue.notificationUIs;
        	var newArr = [];

        	function chunk(arr, size) {
        		for (i=0; i < arr.length; i+=size) {
	        		newArr.push(arr.slice(i, i+size));
	        	}
	        	return newArr;
        	}       	

        	vm.chunkedData = chunk(checkBoxes, 3);
            
        }





        //============ form data

     	vm.deletePatent = function(id){
     		console.log(id)
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
	  	
	}]

});