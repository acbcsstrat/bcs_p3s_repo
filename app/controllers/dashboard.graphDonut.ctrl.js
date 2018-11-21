angular.module('ppApp').controller('graphDonutCtrl', graphDonutCtrl);

graphDonutCtrl.$inject = ['$scope', '$timeout', 'patents', 'patentPhasesService', 'selectPhaseService'];

function graphDonutCtrl( $scope, $timeout, patents, patentPhasesService, selectPhaseService) {

	var vm = this;

	if(patents.length > 0) {
		console.log('hello')
		vm.patents = patents;
		var patenttest;
		$timeout(function(){
			patenttest = patentPhasesService.phases(patents);

		}, 500)
		vm.patentData
		$timeout(function() { //required to load correct size of donut graph in view
			// vm.patentData = patentPhasesService.phases(patents);
      		vm.donutOptions = {
	            chart: {
	                type: 'pieChart',	
	                height: 250,
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
					duration: 500,
	                showLabels: false,
	                pie: {
	                  	dispatch: {
		                    elementClick: function(e) {

								var key = e.data.key;

								selectPhaseService.setPhase(key, vm.patentData);

								$timeout(function(){ //timeout needed to reset carousel content. Colour key emit however is not encapsulated within a timeout method
									$scope.$emit('phaseChange', {phase: key})
								}, 10)								

		                      	switch(key) {
			                      	case 'green':
			                      		$scope.activeTab = 0;
			                      	break;
			                      	case 'amber':
			                      		$scope.activeTab = 1;
			                      	break;
			                      	case 'red':
			                      		$scope.activeTab = 2;
			                      	break;
			                      	case 'blue':
			                      		$scope.activeTab = 3;
			                      	break;
			                      	case 'black':
			                      		$scope.activeTab = 4;
			                      	break;
			                      	case 'grey':
			                      		$scope.activeTab = 5;                      	  	                      	              		                      		                      	
		                      	}
	                    	}
	                	},
	                    startAngle: function(d) { return d.startAngle -Math.PI },
	                    endAngle: function(d) { return d.endAngle -Math.PI }
	                },
	                growOnHover: true,
	                showLegend: false,
	                valueFormat: function(d) {
	                	return d;
	                }
	            }
	        };

	        vm.donutData = [
	        	{
	        		key: 'green', 
	        		y: patenttest.greenRenewals.length,
	        		color: '#53ab58'
	        	},
	        	{
	        		key: 'amber', 
	        		y: 4,
	        		color: '#f9b233'
	        	},
	        	{
	        		key: 'red', 
	        		y: 2,
	        		color: '#e30613'
	        	},
	        	{
	        		key: 'blue',
	        		y: 1,
	        		color: '#0097ce'
	        	},
	        	{
	        		key: 'black', 
	        		y: 1,
	        		color: '#3c3c3b'
	        	},
	        	{
	        		key: 'grey', 
	        		y: patenttest.greyRenewals.length,
	        		color: '#dbdbdb'
	        	}
	        ]

	

  		}, 1000);

	} //if patents end	
}