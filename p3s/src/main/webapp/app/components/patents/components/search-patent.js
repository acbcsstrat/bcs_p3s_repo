app.component('searchpatent', {
	templateUrl: 'p3sweb/app/components/patents/views/search-patent.htm',
	controller: ['searchPatentService', '$state', '$stateParams', '$timeout', '$rootScope', function(searchPatentService, $state, $stateParams, $timeout, $rootScope) {

		var vm = this;

		vm.findPatent = function(patentNo) {
			console.log(patentNo)
			searchPatentService.findPatent(patentNo)
			.then(
				function(data) {
					var patent = data;
					$timeout(function() {
						console.log("Here is patent serach")
						$state.go('add-patent', {obj: patent});
					}, 2000);	
				},
				function(errResponse) {
					console.error('Error while finding patent');
				}
			);
        }

	}

]});




