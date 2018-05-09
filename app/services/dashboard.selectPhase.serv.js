angular.module('ppApp').factory('selectPhaseService', selectPhaseService);

export default function selectPhaseService(){
	
	return { // rather than returning an object literal, return the properties to the service itself

		selectedPhase: '',

		setPhase: function(phase, data) {

			switch(phase) {
				case 'green':

					this.selectedPhase = {
						patents: data.greenRenewals,
						phase: {
			                title: 'Green',
			                bgClass: 'bg-phase-green',
			                nextBgClass: 'bg-phase-amber',
			                index: 0
						}
					}

				break;
				case 'amber':

					this.selectedPhase = {
						patents: data.amberRenewals,
						phase: {
			                title: 'Amber',
			                bgClass: 'bg-phase-amber',
			                nextBgClass: 'bg-phase-red',
			                index: 1
						}
					}

				break;
				case 'red':

					this.selectedPhase = {
						patents: data.redRenewals,	
						phase: {
			                title: 'Red',
			                bgClass: 'bg-phase-red',
			                nextBgClass: 'bg-phase-blue',
			                index: 2
						}
					}	

				break;
				case 'blue':

					this.selectedPhase = {
						patents: data.blueRenewals,	
						phase: {
			                title: 'Blue',
			                bgClass: 'bg-phase-blue',
			                nextBgClass: 'bg-phase-black',
			                index: 3
						}
					}

				break;
				case 'black':

					this.selectedPhase = {
						patents: data.blackRenewals,
						phase: {
			                title: 'Black',
			                bgClass: 'bg-phase-black',
			                nextBgClass: 'bg-phase-white',
			                index: 4
						}									
												
				}
				break;
				case 'grey':
				
					this.selectedPhase = {
						patents: [],
						phase: {
			                title: 'Grey',
			                bgClass: 'bg-phase-grey',
			                index: 5
						}									
												
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
