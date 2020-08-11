RenewalHistoryController.$inject = ['$scope', '$timeout', 'caseSelected', 'RenewalHistoryService']

export default function RenewalHistoryController($scope, $timeout, caseSelected, RenewalHistoryService) {

    var vm = this;

    vm.patent = caseSelected;

    $scope.promise.then(
    	function(){
    		$timeout(function(){
    			vm.renewal = $scope.$parent.renewalHistory;	
    		}, 500)
     
    	}

    )

}