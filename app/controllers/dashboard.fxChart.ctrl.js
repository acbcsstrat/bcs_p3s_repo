angular.module('ppApp').controller('dbfxChartCtrl', dbfxChartCtrl);

dbfxChartCtrl.$inject = ['$scope', '$timeout', 'patentPhasesService', 'fxRatesMonth'];

function dbfxChartCtrl($scope, $timeout, patentPhasesService, fxRatesMonth) {

    var vm = this;
    var fxChartTimeout;

    function init() {
        fxChartTimeout = $timeout(function() {

            vm.lineData = lineData;
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
                    clipEdge: false,
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

        }, 300);
    }

    init();


    function lineData() {

        var chartValueArrs = [];

        for(var i = 0; i < fxRatesMonth.length; i++) {
            chartValueArrs.push([fxRatesMonth[i].rateActiveDate, fxRatesMonth[i].rate]);
        }

        return [
            {
                values: chartValueArrs.reverse(),
                color: '#2ca02c'
            }
        ]

    } //function end

    $scope.$on('$destroy', function(){
        $timeout.cancel(fxChartTimeout)
    })

}
