angular.module('ppApp').factory('patentsService', ['$rootScope', '$timeout', function($rootScope, $timeout){
	
	return {
		activePatentItemMenu: 	function () {
			$timeout(function() {
				$rootScope.$broadcast("renewalHistory");
			}, 100);
			
		}
	};
}]);