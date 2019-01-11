angular.module('ppApp').controller('graphDonutCtrl', graphDonutCtrl);

graphDonutCtrl.$inject = ['$scope', '$timeout', 'patentIds', 'patentPhasesService'];

function graphDonutCtrl( $scope, $timeout, patentIds, patentPhasesService) {

	var vm = this;

	if(patentIds.length > 0) {
		vm.patentData = patentPhasesService.patentNumbers
		$timeout(function() { //required to load correct size of donut graph in view
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

								$timeout(function(){ //timeout needed to reset carousel content. Colour key emit however is not encapsulated within a timeout method
							        patentPhasesService.setPatents(phase);
							        $scope.$emit('phaseChange', {phase: phase})	
								}, 10)

	                    	}
	                	},
	                    startAngle: function(d) { return d.startAngle - Math.PI },
	                    endAngle: function(d) { return d.endAngle - Math.PI }
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

	

  		}, 300);

	} //if patents end	
}