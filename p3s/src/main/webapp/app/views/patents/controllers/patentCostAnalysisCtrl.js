angular.module('ppApp').controller('patentCostAnalysisCtrl', patentCostAnalysisCtrl);

patentCostAnalysisCtrl.$inject = ['patent', 'costAnalysis', '$scope', '$state', '$timeout', '$rootScope', '$location', '$anchorScroll',  'currentTransactionsService']

function patentCostAnalysisCtrl(patent, costAnalysis, $scope, $state, $timeout, $rootScope, $location, $anchorScroll, currentTransactionsService) {

	var vm = this;

	var lineChart = costAnalysis.lineChart;
	var costAnalysisFee = costAnalysis.fee;
	vm.chartActive = 'Stage Cost Chart';
	vm.patent  = patent;
	vm.fetchItemTransaction = fetchItemTransaction;
	vm.fetchItemRenewal = fetchItemRenewal;
	vm.loadChart = loadChart;

	if(costAnalysisFee) {

		vm.feeBreakDown = {
			renewalFeeEUR: costAnalysisFee.renewalFeeEUR,
			renewalFeeUSD: costAnalysisFee.renewalFeeUSD,
			extensionFeeEUR: costAnalysisFee.extensionFeeEUR,
			extensionFeeUSD: costAnalysisFee.extensionFeeUSD,
			processingFeeEUR: costAnalysisFee.processingFeeEUR,
			processingFeeUSD: costAnalysisFee.processingFeeUSD,
			expressFeeUSD: costAnalysisFee.expressFeeUSD,
			expressFeeEUR: costAnalysisFee.expressFeeEUR,
			urgentFeeUSD: costAnalysisFee.urgentFeeUSD,
			urgentFeeEUR: costAnalysisFee.urgentFeeEUR,			
			latePayPenaltyUSD: costAnalysisFee.latePayPenaltyUSD,
			fxRate: costAnalysisFee.fxRate,
			subTotalEUR: costAnalysisFee.subTotalEUR,
			subTotalUSD: costAnalysisFee.subTotalUSD,
			bandSaving: function() {
				var item = {};
				switch(patent.costBandColour) {
					case 'Green':
						item.savings =  Math.round(costAnalysis.amberStageCost - costAnalysis.greenStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Amber':
						item.savings =  Math.round(costAnalysis.redStageCost - costAnalysis.amberStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Red':
						item.savings =  Math.round(costAnalysis.blueStageCost - costAnalysis.redStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Blue':
						item.savings =  Math.round(costAnalysis.blackStageCost - costAnalysis.blueStageCost);
						item.renewBefore = patent.costBandEndDate;
					break;
					case 'Black':
						item.savings =  'N/A';
						item.renewBefore = 'N/A';

				}
				return item;
			}
		};
	}

	vm.lineData = lineData;
    vm.lineOptions = {
        chart: {
            type: 'lineChart',
            height: 350,
            margin : {
            	top: 20,
                right: 50,
                bottom: 70,
                left: 80
            },
            clipEdge: false,
            duration: 500,
            tooltip: {
              hideDelay: 0
            },                      
            showLegend: false,
            x: function(d, i){ 
            	return d[0]
            },
            y: function(d){
            	return d[1]
            },
            useInteractiveGuideline: true,
            xAxis: {
                tickFormat: function (d, i) {
                    return d3.time.format('%x')(new Date(d));
                },
                showMaxMin: false,
                rotateLabels: -30,
                tickPadding: 20                
            },
            yAxis: {
                tickFormat: function(d){
                    return '$ ' + d3.format('.00f')(d);
                },
                showMaxMin: false,
                tickPadding: 20
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
            showYAxis: true
        }
    }

	vm.barData = barData;
    vm.barOptions = {
		chart: {
            type: 'multiBarHorizontalChart',
            height: 350,
            margin : {
                top: 20,
                right: 50,
                bottom: 70,
                left: 90
            },
            duration: 500,
            tooltip: {
              hideDelay: 0
            },
         	barColor: ["#3c3c3b", "#0097ce", "#e30613", "#f9b233", "#53ab58"],     
            x: function(d){
            	return d[0];
            },
            y: function(d){
              	return d[1];
            },
            showControls: false,
            showValues: true,
            showLegend: false,
            stacked: true,
            duration: 500,
            multibar: {
              groupSpacing: 0.4
            },            
            xAxis: {
                showMaxMin: false,
                tickFormat: function (d, i) {
                	return d3.time.format('%x')(new Date(d));
                    
                },
                tickPadding: 20      
            },
            yAxis: {
                tickFormat: function(d){
                    return '$ ' + d3.format('.02f')(d);
                },
                showMaxMin: false,
                tickPadding: 20
            },
            callback: function(d, e) {
            	d3.selectAll('.nvd3 .nv-bar rect').attr("rx", 15);
            }
        }    	

    }

	function barData() {

		var barChartArr = [], label = [], data = [];

		for (var property in costAnalysis) {
		    if (costAnalysis.hasOwnProperty(property)) {
		    	var dayData = costAnalysis[property];		
				if((property.includes('StartDate')) && (!property.includes ('UI'))) {
					label.push(dayData);
				}
				if(property.includes('StageCost')) {
					data.push(dayData);
				}
		    }
		}

		for (var i = 0; label.length && i < data.length; i++) {
			barChartArr[i] = [label[i], data[i]]; //pairs the items from two arrays into a single array in the new array
		}

		barChartArr.reverse();

		return [
			{
				'key': 'Cost',
				'values': barChartArr
			}
		]

	}

	function lineData() {

		var lineDataArr = [];

		for (var property in lineChart) { //change lineChart
		    if (lineChart.hasOwnProperty(property)) {
				const dayData = lineChart[property];
				var d = (dayData.feeActiveDate.split('/'))
				var date = new Date(d[2], d[1] -1, d[0]).getTime();
				lineDataArr.push([date, dayData.subTotal_USD]);
		    }
		}

		return [
			{
                values: lineDataArr,
                color: '#2ca02c'
			}
		]

	}

	function loadChart() {
		$timeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 20)
	}

	$scope.$on('loadChart', loadChart);

	function fetchItemRenewal() {
		$rootScope.$broadcast("renewalHistory"); //REVISE TO SEE IF MORE EFFICIENT WAY
	};

	function fetchItemTransaction(id) {
		currentTransactionsService.fetchCurrentTransactions()
		.then(
			function(response) {
				response.forEach(function(data) {
					const transId = data.id;
					data.renewalUIs.forEach(function(data, i) {
						if(data.patentUI.id == id) { //compare id submitted from view to all array items id
							$state.go('current-transactions.current-transaction-item',{transId: transId}) //if match, go current-transaction-item
							.then(
								function(response){
									$timeout(function() {
										$location.hash('currTransAnchor'); 
									  	$anchorScroll();  //scroll to anchor href
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
	
}