angular.module('ppApp').controller('searchPatentCtrl', searchPatentCtrl);

searchPatentCtrl.$inject = ['$state', '$stateParams', '$scope', '$rootScope', '$timeout', 'searchPatentService'];

function searchPatentCtrl($state, $stateParams, $scope, $rootScope, $timeout, searchPatentService) {

	var vm = this;

	$rootScope.page = 'Search for Patent';

    $timeout(function() {
      vm.animate = true;
    }, 300);    

    vm.findPatent = findPatent

	function findPatent(patentNo) {
		searchPatentService.findPatent(patentNo)
		.then(
			function(response) {

				if(response.status == 204 || response.data == '') {
					vm.queriedPatent = null;
					$state.go('search-patent', {}, {reload: true});
					vm.searchError = 'It looks like we’ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				} else {
					var patentJson = angular.toJson(response)
					$state.go('search-patent.add-patent', {patent: patentJson});
				}

			},
			function(errResponse) {
				vm.queriedPatent = null;
				switch(errResponse.status) {
					case 400:
						vm.searchError = 'We\'ve not been able to find that patent in the European Patent Register.  Please enter an application number such as 18 123456.2';
					break;
					case 404:
						vm.searchError = 'We’ve not been able to find Patent Application '+patentNo+' in the European Patent Register.  Please check the number you’re entering and try again.';
					break;
					case 204:
						vm.searchError = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				}
			}
		);
    }  	

};