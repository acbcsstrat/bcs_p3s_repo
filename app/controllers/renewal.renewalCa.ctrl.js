angular.module('ppApp').controller('renewalCaCtrl', renewalCaCtrl);

renewalCaCtrl.$inject = ['patent','ca', '$timeout', 'chunkDataService', 'costAnalysisService'];

function renewalCaCtrl(patent, ca, $timeout, chunkDataService, costAnalysisService) {

    var vm = this;

    if(typeof ca !== 'undefined' || ca !== null ) {
        
        vm.ca = ca;
        vm.patent = patent;
        vm.barData = barData;
        vm.loadChart = loadChart;   
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
                    showMaxMin: true,
                    tickFormat: function (d, i) {
                        return d3.time.format('%x')(new Date(d));
                        
                    },
                    tickPadding: 20,
                    showMaxMin: true
                },
                yAxis: {
                    tickFormat: function(d){
                        return '$ ' + d3.format('.02f')(d);
                    },
                    showMaxMin: false,
                    tickPadding: 20,
                    showMaxMin: true
                },
                callback: function(d, e) {
                    d3.selectAll('.nvd3 .nv-bar rect').attr("rx", 15);
                }
            }
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
                    showMaxMin: true,
                    rotateLabels: -30,
                    tickPadding: 20,
                    ticks: 4        
                },
                yAxis: {
                    tickFormat: function(d){
                        return '$ ' + d3.format('.00f')(d);
                    },
                    showMaxMin: true,
                    // showMaxMin: false,
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

        function init() {
            loadChart();
        }

        function barData() {

            var barChartArr = [], label = [], data = [];

            for (var property in ca) {
                if (ca.hasOwnProperty(property)) {
                    var dayData = ca[property];       
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

            for (var property in ca.lineChart) { //change ca.lineChart
                if (ca.lineChart.hasOwnProperty(property)) {
                    const dayData = ca.lineChart[property];
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
                var evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }, 20)
        }

        $timeout(function(){
            init();
        }, 100)
    }

}