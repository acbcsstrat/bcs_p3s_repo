angular.module('ppApp').controller('searchPatentCtrl', searchPatentCtrl);

searchPatentCtrl.$inject = ['$state', '$stateParams', '$scope', '$rootScope', '$timeout', 'searchPatentService'];

function searchPatentCtrl($state, $stateParams, $scope, $rootScope, $timeout, searchPatentService) {

	var vm = this;

	vm.pageTitle = 'Search for Patent';
	vm.queriedPatent = true;

    var animateTimeout = $timeout(function() {
      vm.animate = true;
    }, 300);    

    vm.findPatent = findPatent;

	function findPatent(patentNo) {
		vm.loadingPatent = true;
		searchPatentService.findPatent(patentNo)
		.then(
			function(response) {
				vm.loadingPatent = false;
				vm.error = false;
				var patentJson = angular.toJson(response)
				$state.go('search-patent.add-patent', {patent: patentJson});
			},
			function(errResponse) {

				vm.queriedPatent = false;
				vm.loadingPatent = false;
				vm.error = true;
				$state.go('search-patent', {}, {reload: false});
				if(errResponse.status == 412) { //already added patent
					vm.searchError = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
				} 
				if(errResponse.status == 409){ //incorrect check digit
					vm.searchError = 'It looks like the provided check digit differs from the check digit found at the European Patent Register. Please make sure the check digit is correct and try again.';
				}
				if(errResponse.status == 400) { //incorrect syntax
					vm.searchError = 'We\'ve not been able to find that patent in the European Patent Register. Please enter an application number such as EP18123456.2';
				}


			}
		)

    }

    $scope.$on('$destroy', function(){
    	$timeout.cancel(animateTimeout)
    })

};