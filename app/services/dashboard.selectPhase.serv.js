angular.module('ppApp').factory('selectPhaseService', selectPhaseService);

function selectPhaseService(){
	
	return { // rather than returning an object literal, return the properties to the service itself

		selectedPhase: '',

		setPhase: function(phase, data) {

			switch(phase) {
				case 'green':

					this.selectedPhase = {
						patents: data.greenRenewals,
						phase: 'Green',
						index: 0
					}

				break;
				case 'amber':

					this.selectedPhase = {
						patents: data.amberRenewals,
						phase: 'Amber',
			            index: 1
					}

				break;
				case 'red':

					this.selectedPhase = {
						patents: data.redRenewals,	
						phase: 'Red',
		                index: 2
					}	

				break;
				case 'blue':

					this.selectedPhase = {
						patents: data.blueRenewals,	
						phase: 'Blue',
		                index: 3
					}

				break;
				case 'black':

					this.selectedPhase = {
						patents: data.blackRenewals,
						phase: 'Black',
			            index: 4
					}

				break;
				case 'grey':
				
					this.selectedPhase = {
						patents: [],
			                title: 'Grey',
			                index: 5							
					}

				break;
				case 'reset':

					this.selectedPhase = {
						patents: []					
					}
	
			}
		},
		getPhase: function() {

			return this.selectedPhase;

		}

	} //return end
}
