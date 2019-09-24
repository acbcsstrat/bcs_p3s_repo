angular.module('ppApp').controller('searchPatentCtrl', searchPatentCtrl);

searchPatentCtrl.$inject = ['$state', '$stateParams', '$scope', '$rootScope', '$timeout', 'searchPatentService'];

function searchPatentCtrl($state, $stateParams, $scope, $rootScope, $timeout, searchPatentService) {

	var vm = this;

	vm.pageTitle = 'Search for Patent';

    $timeout(function() {
      vm.animate = true;
    }, 300);    

    vm.findPatent = findPatent;

	function findPatent(patentNo) {
		vm.loadingPatent = true;
		searchPatentService.findPatent(patentNo)
		.then(
			function(response) {
				if(response.status == 204 && response.data == '') {
					vm.loadingPatent = false;
					vm.error = true;
					$state.go('search-patent', {}, {reload: false});
					vm.searchError = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				} else {
					vm.loadingPatent = false;
					vm.error = false;
					var patentJson = angular.toJson(response)
					$state.go('search-patent.add-patent', {patent: patentJson});

				}

			},
			function(errResponse) {
				vm.queriedPatent = null;
				vm.searchError = errResponse.data;

			}
		)

    }  	

};