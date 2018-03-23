function fxChartCtrl($scope, $timeout, patents, patentPhasesService, fxRatesMonth) {

	var vm = this;

	vm.$onInit = function() {

		chartValueArrs = [];

		for(var i = 0; i < fxRatesMonth.length; i++) {
			chartValueArrs.push([fxRatesMonth[i].rateActiveDate, fxRatesMonth[i].rate]);
		}

		if(patents) {

			vm.patentData = patentPhasesService.phases(patents);

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
		                tooltip: {
						  hideDelay: 0
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

	      	}, 200);

		} //if patents end	
	}
}

angular.module('ppApp').controller('fxChartCtrl', fxChartCtrl);