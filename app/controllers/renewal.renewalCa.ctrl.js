angular.module('ppApp').controller('renewalCaCtrl', renewalCaCtrl);

renewalCaCtrl.$inject = ['patent','ca', '$timeout', 'chunkDataService', 'costAnalysisService', 'currentTransactionsService'];

function renewalCaCtrl(patent, ca, $timeout, chunkDataService, costAnalysisService, currentTransactionsService) {

    var vm = this;

    vm.fetchItemTransaction = fetchItemTransaction;

    if(typeof ca !== 'undefined' || ca !== null ) {
        
        vm.ca = ca;
        vm.patent = patent;
        vm.barData = barData;
        vm.loadChart = loadChart;
        vm.fetchItemTransaction = fetchItemTransaction;
        vm.barOptions = {
            chart: {
                type: 'multiBarHorizontalChart',
                barColor: ["#3c3c3b", "#0097ce", "#e30613", "#f9b233", "#53ab58"],
                tooltip: {
                  hideDelay: 0
                },                 
                height: 300,
                showControls: false,
                showValues: true,
                showLegend: false,
                stacked: true,
                duration: 500,
                margin: {
                    left: 70,
                    right: 10
                },
                x: function(d){
                    return d[0];
                },
                y: function(d){
                    return d[1];
                },
                multibar: {
                    groupSpacing: 0.4
                },
                xAxis: {
                    showMaxMin: false,
                    axisLabelDistance: 0,
                    staggerLabels: false,
                    rotateLabels: 0,
                    rotateYLabel: true,
                    axisLabel: null,
                    height: 60,
                    ticks: null,
                    width: 2000,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    duration: 250,
                    orient: 'left',
                    tickValues: null,
                    tickSubdivide: 0,
                    tickSize: 6,
                    tickPadding: 5,
                    domain: [
                        0,
                        1
                    ],
                    range: [
                        0,
                        1
                    ],             
                    tickFormat: function (d, i) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },
                yAxis: {
                    showMaxMin: true,
                    axisLabelDistance: 20,
                    staggerLabels: false,
                    rotateLabels: 0,
                    rotateYLabel: true,
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
                    tickPadding: 3,
                    domain: [
                        0,
                        1
                    ],
                    range: [
                        0,
                        1
                    ],                 
                    tickFormat: function(d){
                        return '$ ' + d3.format('.02f')(d);
                    }
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
        function init() {
            loadChart();
        }

        function fetchItemTransaction(id) {
            currentTransactionsService.fetchCurrentTransactions()
            .then(
                function(response) {

                    var match = response.filter(function(el){
                        return el.serviceUIs.find(function(item){
                            return item.patentUI.id === id;
                        })
                    })

                    if(match !== undefined || typeof match !== 'undefined') {
                        $state.go('current-transactions.current-transaction-item',{transId: match[0].id}) //if match, go current-transaction-item
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

                },
                function(errResponse) {
                    console.log(errResponse);
                }
            );
        };        

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

        function fetchItemTransaction(id) {
            console.log(id)
            currentTransactionsService.fetchCurrentTransactions()
            .then(
                function(response) {
                    console.log(response)
                    var transaction = response.filter(function(el){
                        return el.renewalUIs.find(function(item) {
                            return item.patentUI.id === id;
                        })
                    })

                    if(transaction !== undefined || typeof transaction !== 'undefined') {
                        $state.go('current-transactions.current-transaction-item',{transId: transaction[0].id}) //if match, go current-transaction-item
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

                },
                function(errResponse) {
                    console.log(errResponse);
                }
            );
        };            
    }

}