angular.module('ppApp').factory('patentPhasesService', patentPhasesService);

patentPhasesService.$inject = ['$timeout', '$q', '$rootScope', 'calculateService', 'patentsRestService', 'organiseTextService']

function patentPhasesService ($timeout, $q,  $rootScope, calculateService, patentsRestService, organiseTextService) {
	
	var factory = {
		newPhases: newPhases,
		phases: phases
	};

		function newPhases() {
			return patentsRestService.fetchAllPatents()
			.then(function(response){
				console.log(response)
			})
		}

		function phases(patents) {

			var ids = patents.map(function(item){
               return item.id;
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

			function getPatents() {

                var deferred = $q.defer();
                var nestedPatents = [];
                angular.forEach(ids, function(id) {
                    nestedPatents.push(patentsRestService.fetchPatentItem(id));
                });                            
                $q.all(nestedPatents)
                .then(function(patent){
                    deferred.resolve(patent)
                })
                return deferred.promise;

			}

			getPatents()
			.then(function(response){
				if(response.length > 0) {
					response.forEach(function(item) {
						var service = item.renewalFeeUI !== null ? item.renewalStatus : item.epctStatus;
						if(organiseTextService.actionStatus(service) || organiseTextService.paymentStatus(service)) {
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
						} else {
							if(item.portfolioUI.serviceList.length === 0) {
								phases.greyRenewals.push(item);
							}
							if(item.portfolioUI.serviceList.length > 0) {
								if(item.portfolioUI.serviceList[0].currentStageColour == 'Red' ) {
									phases.redRenewals.push(item);
								}
								if(item.portfolioUI.serviceList[0].currentStageColour == 'Grey' ) {
									phases.greyRenewals.push(item);
								}							
							}
						} 			
					});

				}
			})



			return phases;

		}

	return factory;

}