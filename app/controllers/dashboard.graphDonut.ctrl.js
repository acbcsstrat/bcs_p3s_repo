angular.module('ppApp').controller('graphDonutCtrl', graphDonutCtrl);

graphDonutCtrl.$inject = ['$stateParams', '$scope', '$timeout', 'dashboardService'];

function graphDonutCtrl($stateParams, $scope, $timeout, dashboardService) {

	var vm = this;
	var graphtDonutTimeout;

	function init() {

		if($stateParams.patents.length > 0) {
			vm.patentData = dashboardService.getPatents;
			graphtDonutTimeout = $timeout(function() { //required to load correct size of donut graph in view
	      		vm.donutOptions = {
		            chart: {
		                type: 'pieChart',	
		                height: 200,
		                donut: true,
		                margin: { top: 0, right: 0, bottom: 0, left: 0 },
		                tooltip: {
						  hideDelay: 0
						},
		                x: function(d){
		                	return d.key;
		                },
		                y: function(d){
		                	return d.y;
		                },
		                donutRatio: 0.60,
						duration: 500,
		                showLabels: false,
		                showLegend: false,
		                valueFormat: function(d) {
		                	return d;
		                }
		            }
		        };

		        vm.donutData = [
		        	{
		        		key: 'Green', 
		        		y: vm.patentData.Green.length,
		        		color: '#53ab58'
		        	},
		        	{
		        		key: 'Amber', 
		        		y: vm.patentData.Amber.length,
		        		color: '#f9b233'
		        	},
		        	{
		        		key: 'Red', 
		        		y: vm.patentData.Red.length,
		        		color: '#e30613'
		        	},
		        	{
		        		key: 'Blue',
		        		y: vm.patentData.Blue.length,
		        		color: '#0097ce'
		        	},
		        	{
		        		key: 'Black', 
		        		y: vm.patentData.Black.length,
		        		color: '#3c3c3b'
		        	},
		        	{
		        		key: 'Grey', 
		        		y: vm.patentData.Grey.length,
		        		color: '#dbdbdb'
		        	}
		        ]


		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);

	  		}, 1000);


		} //if patents end	
	}

	init()



	$scope.$on('$destroy', function(){
		$timeout.cancel(graphtDonutTimeout);
	})
}