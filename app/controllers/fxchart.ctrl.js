angular.module('ppApp').controller('fxChartCtrl', fxChartCtrl);

fxChartCtrl.$inject = ['patent', 'ca', '$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll']

function fxChartCtrl(patent, ca, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll) {

    var vm = this;

    vm.patent = patent;
    vm.setData = setData;
    vm.lineData = null;

    if($scope.$parent.availableServices.length > 0) {
        
        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action }

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

            vm.setData(vm.data.selectedAction.action)

            function setData(data) {
  
                vm.lineData = null;

                var lineDataArr = [];
                var fxData;

                if(data === undefined || typeof data === 'undefined') {
                    return;
                }

                if(data == 'Form1200') {
                    fxData = ca[0].data.lineChart;
                    for (var property in fxData) { //change lineData
                        if (fxData.hasOwnProperty(property)) {
                            var dayData = fxData[property];
                            var str = property.split("T").shift();
                            var date = new Date(str).getTime();
                            lineDataArr.push([date, dayData]);
                        }
                    }
                }

                if(data == 'Renewal') {
                    fxData = ca[0].data.lineChart;
                    for (var property in fxData) { //change lineData
                        if (fxData.hasOwnProperty(property)) {
                            var dayData = fxData[property].currentOfficialFeeUSD; //different object structure to form1200 (not sure why)
                            var str = property.split("T").shift();
                            var date = new Date(str).getTime();
                            lineDataArr.push([date, dayData]);
                        }
                    }                
                }

                vm.lineData = [
                    {
                        values: lineDataArr,
                        color: '#2ca02c'
                    }
                ]

            }  //setData send
        }
    }
}