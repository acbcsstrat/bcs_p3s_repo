RenewalsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

export default function RenewalsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var renewalGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){

			renewalGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
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
		        	Object.keys($scope.formalityData.renewal).forEach(function(item){
		        		counter += $scope.formalityData.renewal[item].length;
		        	})
		        	return counter;

		        }

		        vm.donutData = {
		        	phases: [
			        	{
			        		key: 'Green', 
			        		y: $scope.formalityData.renewal.Green.length,
			        		color: '#53ab58'
			        	},
			        	{
			        		key: 'Amber', 
			        		y: $scope.formalityData.renewal.Amber.length,
			        		color: '#f9b233'
			        	},
			        	{
			        		key: 'Red', 
			        		y: $scope.formalityData.renewal.Red.length,
			        		color: '#e30613'
			        	},
			        	{
			        		key: 'Blue',
			        		y: $scope.formalityData.renewal.Blue.length,
			        		color: '#0097ce'
			        	},
			        	{
			        		key: 'Black', 
			        		y: $scope.formalityData.renewal.Black.length,
			        		color: '#3c3c3b'
			        	},
			        	{
			        		key: 'Grey', 
			        		y: $scope.formalityData.renewal.Grey.length,
			        		color: '#dbdbdb'
			        	}
		        	],
		        	total: formalityTotal()

		       	}	        

	            var evt = document.createEvent('UIEvents');
	            evt.initUIEvent('resize', true, false, window, 0);
	            window.dispatchEvent(evt);

	  		}, 300);

			$scope.$on('$destroy', function(){
				$timeout.cancel(renewalGraphTimeout);
			})

		}
	)

}