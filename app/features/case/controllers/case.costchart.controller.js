CostChartController.$inject = ['caseSelected', 'ca','$scope', '$timeout']

export default function CostChartController(caseSelected, ca, $scope, $timeout) {

    var vm = this;

    vm.patent = caseSelected;
    vm.setData = setData;
    vm.barData = null;
    var costTimeout;

    $scope.$parent.promise
    .then(
        function(response){

            if(response.length > 0 && $scope.$parent.availableServices.length) {
                costTimeout = $timeout(function(){

                    vm.data = {};
                    vm.data.availableAction = $scope.$parent.availableServices;
                    vm.data.selectedAction = { id: vm.data.availableAction[0].id, action: vm.data.availableAction[0].action };

                    if(ca !== undefined || typeof ca !== 'undefined') {
             
                        vm.barOptions = {
                            chart: {
                                type: 'multiBarHorizontalChart',
                                barColor: [],
                                tooltip: {
                                    hideDelay: 0,
                                    contentGenerator: function(d) {
                                        var str = '<div style="font-weight:bold; margin:auto; text-align:center;">' +d.data.tip +'</div>';
                                        return str;
                                    }
                                },                
                                height: 350,
                                showControls: false,
                                showValues: true,
                                showLegend: false,
                                stacked: true,
                                duration: 500,
                                margin: {
                                    left: 90,
                                    right: 10
                                },
                                x: function(d){
                                    return d.x;
                                },
                                y: function(d){
                                    return d.y;
                                },
                                multibar: {
                                    groupSpacing: 0.4
                                },
                                xAxis: {
                                    axisLabel: 'Date',
                                    tickFormat: function(d) {
                                        return d3.time.format('%x')(new Date(d))
                                    },
                                    axisLabelDistance: 25,                         
                                    showMaxMin: false,
                                    rotateYLabel: true, orient: 'left', css:{ 'transform':'rotate(45deg)' }
                                },
                                yAxis: {
                                    axisLabel: 'Cost',
                                    tickFormat: function(d){
                                        return d3.format('.02f')(d);
                                    },       
                                    showMaxMin: false
                                }
                            }
                        } //barOptions end

                    }   

                    setData(vm.data.selectedAction.action)
                })
               
            } //outer if condition
        }
    )


    function setData(type) {

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

        var barChartArr = [], label = [], barData = [], tip = [];;

        var objIndex = 0;

        for(var item in barChartData[0]) {
            if(barChartData[0].hasOwnProperty(item)) {
                if((item.includes('StartDate')) && (!item.includes('UI'))) {
                    label.push(barChartData[0][item]);
                }

                if((item.includes('StartDateUI'))) {
                    tip.push(barChartData[0][item]);
                }

                if(item.includes('Cost') && barChartData[0][item] !== null) {
                    barData.push(barChartData[0][item]);
                }
            }
        }
      
        for (var i = 0; label.length && i < barData.length; i++) {
            barChartArr[i] = {'y': barData[i], 'x':label[i], 'tip':tip[i]}; //pairs the items from two arrays into a single array in the new array
        }

        barChartArr.reverse();

        vm.barData = [
            {
                'key': 'Cost',
                'values': barChartArr
            }
        ]
    }

    $scope.$on('$destroy', function(){
        $timeout.cancel(costTimeout)
    })

}