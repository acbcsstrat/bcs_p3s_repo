angular.module('ppApp').controller('fxChartCtrl', fxChartCtrl);

fxChartCtrl.$inject = ['patent', 'ca', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll']

function fxChartCtrl(patent, ca, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll) {

    var vm = this;

    vm.patent = patent;
    vm.loadChart = loadChart;
    vm.data = {}
    vm.data.availableAction = $scope.$parent.availableServices;
    vm.data.selectedAction = {id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action }

    console.log(vm.data)

    if(ca !== undefined || typeof ca !== 'undefined') {

        

        vm.lineOptions = {
            chart: {
                type: 'lineChart',
                height: 350,
                margin : {
                    top: 30,
                    right: 50,
                    bottom: 30,
                    left: 50
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
                    axisLabelDistance: 20,
                    staggerLabels: false,
                    rotateLabels: 0,
                    rotateYLabel: true,
                    showMaxMin: true,
                    height: 60,
                    ticks: null,
                    width: 75,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    duration: 250,
                    orient: 'bottom',
                    tickValues: null,
                    tickSubdivide: 0,
                    tickSize: 6,
                    tickPadding: 10,
                    domain: [
                        0,
                        1
                    ],
                    range: [
                        0,
                        1
                    ]           
                },
                yAxis: {
                    tickFormat: function(d){
                        return '$ ' + d3.format('.00f')(d);
                    },
                    axisLabelDistance: 20,
                    rotateLabels: 0,
                    rotateYLabel: true,
                    showMaxMin: true,
                    height: 60,
                    width: 75,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: -30
                    },
                    duration: 250,
                    orient: 'left',
                    tickValues: null,
                    tickSubdivide: 0,
                    tickSize: 6,
                    tickPadding: 10,
                    domain: [
                        0,
                        1
                    ],
                    range: [
                        0,
                        1
                    ]
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



        function lineData() {

            var lineDataArr = [];
            for (var property in ca.lineChart) { //change ca.lineChart
                if (ca.lineChart.hasOwnProperty(property)) {
                    const dayData = ca.lineChart[property];
                    var str = property.split("T").shift();
                    var date = new Date(str).getTime();

                    lineDataArr.push([date, dayData]);
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
            //add loading gif here
            $timeout(function(){
                vm.lineData = lineData;                
                var evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }, 3000)
        }

        loadChart()

    }
    
    
}