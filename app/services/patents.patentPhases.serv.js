angular.module('ppApp').factory('patentPhasesService', patentPhasesService);

patentPhasesService.$inject = ['$timeout', '$q', '$rootScope', 'calculateService', 'patentsRestService', 'organiseTextService']

function patentPhasesService ($timeout, $q, $rootScope, calculateService, patentsRestService, organiseTextService) {
	
	var factory = {};

		factory.phases = function(patents) {

			var patentArr = [];
			patents.forEach(function(el){
				patentsRestService.fetchPatentItem(el.id)
				.then(
					function(response){
						patentArr.push(response)
					},
					function(){

					}
				)
			})

			var phases = {
				greenRenewals: [],
				redRenewals: [],
				amberRenewals: [],
				blueRenewals: [],
				blackRenewals: [],
				greyRenewals: [],
				allRenewals: [],
				totalRenewals: function() {
					if(patents.length > 0) {
						return this.greenRenewals.concat(this.amberRenewals, this.redRenewals, this.amberRenewals, this.blueRenewals, this.blackRenewals, this.greyRenewals).length// totalRenewals: 
					} else {
						return 0;
					}
				}
			}

			$timeout(function(){
				if(patentArr.length > 0) {
					patentArr.forEach(function(item) {

						var service = item.renewalFeeUI !== null ? item.renewalStatus : item.epctStatus;
						if(organiseTextService.actionStatus(service)) {
							switch(item.portfolioUI.serviceList[0].currentStageColour) {
								case 'Green':
									phases.greenRenewals.push(item);
								break;
								case 'Amber':
									phases.amberRenewals.push(item);
								break;
								case 'Red':
									phases.redRenewals.push(item);
								break;
								case 'Blue':
									phases.blueRenewals.push(item);
								break;
								case 'Black':
									item.nextStage = 'LAPSE'
									phases.blackRenewals.push(item);
								break;
								
							}
						} else if(item.portfolioUI.serviceList[0].currentStageColour == 'Red') { 
							phases.redRenewals.push(item);
						} else {
							phases.greyRenewals.push(item);
						}

						
					});
					// console.log(phases)
					
				}
				
			}, 1500)

			return phases;
		}

	return factory;

}