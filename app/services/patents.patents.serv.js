angular.module('ppApp').factory('patentsService', patentsService);

patentsService.$inject = ['$rootScope', '$timeout'];

export default function patentsService($rootScope, $timeout){
	
	return {
		activePatentItemMenu: 	function () {
			$timeout(function() {
				$rootScope.$broadcast("renewalHistory");
			}, 100);
			
		}
	};
}