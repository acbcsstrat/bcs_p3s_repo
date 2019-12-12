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

            function setData(type) {

                vm.lineData = null;

                if(type === undefined || typeof type === 'undefined') {
                    return;
                }

                var fxChartData = ca.filter(function(item){
                    if(item.info == 'epct') { item.info = 'Euro-PCT' }
                    return item.info === type;
                }).map(function(data){
                    return data.data.lineChart;
                })

                var lineDataArr = [];

                for (var property in fxChartData[0]) { //change lineData
                    if (fxChartData[0].hasOwnProperty(property)) {
                        var dayData = fxChartData[0][property].currentOfficialFeeUSD !== undefined ? fxChartData[0][property].currentOfficialFeeUSD : fxChartData[0][property];
                        var str = property.split("T").shift();
                        var date = new Date(str).getTime();
                        lineDataArr.push([date, dayData]);
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