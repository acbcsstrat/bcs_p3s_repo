EuropctsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

export default function EuropctsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var epctGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){
			
			epctGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
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

		        var formalityTotal = function() {
		        	var counter = 0;
		        	Object.keys($scope.formalityData.epct).forEach(function(item){
		        		counter += $scope.formalityData.epct[item].length;
		        	})
		        	return counter;

		        }		        

		        vm.donutData = {
		        	phases: [
			        	{
			        		key: 'Green', 
			        		y: $scope.formalityData.epct.Green.length,
			        		color: '#53ab58'
			        	},
			        	{
			        		key: 'Amber', 
			        		y: $scope.formalityData.epct.Amber.length,
			        		color: '#f9b233'
			        	},
			        	{
			        		key: 'Red', 
			        		y: $scope.formalityData.epct.Red.length,
			        		color: '#e30613'
			        	},
			        	{
			        		key: 'Grey', 
			        		y: $scope.formalityData.epct.Grey.length,
			        		color: '#dbdbdb'
			        	}
			        ],
		        	total: formalityTotal()
		        }
		        	

	            var evt = document.createEvent('UIEvents');
	            evt.initUIEvent('resize', true, false, window, 0);
	            window.dispatchEvent(evt);
	           
	  		}, 300);


		} //if patents end	
	)

	$scope.$on('$destroy', function(){
		$timeout.cancel(epctGraphTimeout);
	})
}