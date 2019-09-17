angular.module('ppApp').component('caseoverviewnav', {
    templateUrl: 'app/templates/nav/nav.caseoverview-nav.tpl.htm',
    controller: ['$rootScope', '$scope', '$state', '$stateParams', 'renewalRestService', 'patentsRestService', '$q',function($rootScope, $scope, $state, $stateParams, renewalRestService, patentsRestService, $q){

		var vm = this;

		vm.activePatentItemMenu = 'Patent Info';
		vm.loading = true;
		// vm.serviceAvailable = serviceAvailable;
		vm.showRenewals

		function fetchPatent() {
			var deferred = $q.defer();

			patentsRestService.fetchPatentItem($stateParams.patentId)
			.then(
				function(response){
					deferred.resolve(response)
				},
				function(errResponse){
					deferred.reject(errResponse)
				}
			)
			
			return deferred.promise

		}

		function serviceAvailable() {
			var promise = fetchPatent($stateParams.patentId)

			promise.then(
				function(response){
					return response;
				}
			)
			.then(
				function(response){
					return renewalRestService.fetchHistory(response.id)
					.then(
						function(historyResp){

							var history = historyResp.length === 0 ? false: true;
							var obj = {patent: response, histroy: history};
							return obj;
						}
					)
					
				}
			)
			.then(
				function(response){
					for(var i = 0; i < response.patent.portfolioUI.serviceList.length; i++) {
						if(response.patent.portfolioUI.serviceList[i].serviceType == 'Renewal' || response.histroy === true) { 						
							vm.showRenewal = true;


						}
						if(response.patent.portfolioUI.serviceList[i].serviceType == 'Form1200') {
							vm.showForm1200 = true;
						}
					}
				}
			)

		}

		serviceAvailable()

    }]
})
