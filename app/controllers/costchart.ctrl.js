angular.module('ppApp').controller('costChartCtrl', costChartCtrl);

costChartCtrl.$inject = ['patent', 'ca','$scope', '$timeout', '$state', 'organiseTextService', '$location', 'currentTransactionsService', '$anchorScroll']

function costChartCtrl(patent, ca, $scope, $timeout, $state, organiseTextService, $location, currentTransactionsService, $anchorScroll) {

    var vm = this;

    vm.patent = patent;
    vm.setData = setData;
    vm.barData = null;

    if($scope.$parent.availableServices.length > 0) {

        vm.data = {};
        vm.data.availableAction = $scope.$parent.availableServices;
        vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };
        

        if(ca !== undefined || typeof ca !== 'undefined') {
 
            vm.barOptions = {
                chart: {
                    type: 'multiBarHorizontalChart',
                    barColor: [],
                    tooltip: {
                      hideDelay: 0
                    },
                    height: 350,
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
                        d3.selectAll('.nvd3 .nv-bar rect').attr("rx", 20);
                    }
                }
            } //barOptions end

            vm.setData(vm.data.selectedAction.action)

                function setData(type) {

                    vm.barData = null;

                    if(type === undefined || typeof type === 'undefined') {
                        return;
                    }

                    var barChartData = ca.filter(function(item){
                        if(item.info == 'epct') { item.info = 'Euro-PCT' }
                        return item.info === type;
                    }).map(function(data){
                        return data.data;
                    })
              
                    if(type == 'renewal') {
                        vm.barOptions.chart.barColor = ["#3c3c3b", "#0097ce", "#e30613", "#f9b233", "#53ab58"];
                    }

                    if(type == 'Euro-PCT' || type == 'grant') {
                        vm.barOptions.chart.barColor = ["#e30613", "#f9b233", "#53ab58"];
                    }     

                    var barChartArr = [], label = [], barData = [];
                    for(var item in barChartData[0]) {
                        if(barChartData[0].hasOwnProperty(item)) {
                            if((item.includes('StartDate')) && (!item.includes('UI'))) {
                                label.push( barChartData[0][item]);
                            }

                            if(item.includes('Cost') && barChartData[0][item] !== null) {
                                barData.push(barChartData[0][item]);
                            }
                        }
                    }
                  
                    for (var i = 0; label.length && i < barData.length; i++) {
                        barChartArr[i] = [label[i], barData[i]]; //pairs the items from two arrays into a single array in the new array
                    }


                    barChartArr.reverse();

                    vm.barData = [
                        {
                            'key': 'Cost',
                            'values': barChartArr
                        }
                    ]
                }
            }//ca check
        } //outer if condition
    }

    
