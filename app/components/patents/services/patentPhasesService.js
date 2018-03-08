app.factory('patentPhasesService', patentPhasesService);

function patentPhasesService ($timeout, $q, $rootScope, calculateService) {
	
	var factory = {};

		factory.phases = function(patents) {

			if(patents) {

				var phases = {
					greenRenewals: [],
					redRenewals: [],
					amberRenewals: [],
					blueRenewals: [],
					blackRenewals: [],
					greyRenewals: [],
					totalRenewals: function() {
						if(patents) {
							return this.greenRenewals.concat(this.amberRenewals, this.redRenewals, this.amberRenewals, this.blueRenewals, this.blackRenewals, this.greyRenewals).length// totalRenewals: 
						} else {
							return 0;
						}
					}
				}

				patents.forEach(function(item) {
					if(item.renewalStatus !== 'Renewal in place' && item.renewalStatus !== 'Too late to renew' && item.renewalStatus !== 'No renewal needed'  && item.renewalStatus !== 'Way too late to renew') {

						switch(item.costBandColour) {
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
								phases.blackRenewals.push(item);
							break;
						}
					} else {
						phases.greyRenewals.push(item);
					}
				});

				$timeout(function() {
					phases.greenRenewals.forEach(function(data, i){
						data.progressBar = calculateService.phaseProgress(data, i);
					});
					phases.amberRenewals.forEach(function(data, i){
						data.progressBar = calculateService.phaseProgress(data, i);
					});
					phases.redRenewals.forEach(function(data, i){
						data.progressBar = calculateService.phaseProgress(data, i);
					});
					phases.blueRenewals.forEach(function(data, i){
						data.progressBar = calculateService.phaseProgress(data, i);
					});
					phases.blackRenewals.forEach(function(data, i){
						data.progressBar = calculateService.phaseProgress(data, i);
					});												
				}, 200);

				return phases;

			}

		}

	return factory;

}