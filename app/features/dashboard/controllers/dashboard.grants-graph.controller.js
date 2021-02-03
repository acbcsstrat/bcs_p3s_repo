GrantsDonutController.$inject = ['$stateParams', '$scope', '$timeout'];

export default function GrantsDonutController($stateParams, $scope, $timeout) {

	var vm = this;
	var grantGraphTimeout;

	$scope.$parent.promise
	.then(
		function(response){

			if(response.length) {

				grantGraphTimeout = $timeout(function() { //required to load correct size of donut graph in view
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
			        	Object.keys($scope.formalityData.grant).forEach(function(item){
			        		counter += $scope.formalityData.grant[item].length;
			        	})
			        	return counter;

			        }

			        vm.donutData = {
			        	phases: [
				        	{
				        		key: 'Green', 
				        		y: $scope.formalityData.grant.Green.length,
				        		color: '#53ab58'
				        	},
				        	{
				        		key: 'Amber', 
				        		y: $scope.formalityData.grant.Amber.length,
				        		color: '#f9b233'
				        	},
				        	{
				        		key: 'Red', 
				        		y: $scope.formalityData.grant.Red.length,
				        		color: '#e30613'
				        	},
				        	{
				        		key: 'Grey', 
				        		y: $scope.formalityData.grant.Grey.length,
				        		color: '#dbdbdb'
				        	},
			        	],
			        	total: formalityTotal()
		        	}		        	
			        
		            var evt = document.createEvent('UIEvents');
		            evt.initUIEvent('resize', true, false, window, 0);
		            window.dispatchEvent(evt);

		  		}, 300);

			}

		} //if patents end	
	)

	$scope.$on('$destroy', function(){
		$timeout.cancel(grantGraphTimeout);
	})
}