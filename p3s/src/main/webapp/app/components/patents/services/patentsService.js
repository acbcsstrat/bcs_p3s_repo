app.factory('patentsService', function($rootScope, $timeout){
	
	return {
		activePatentItemMenu: 	function () {
			$timeout(function() {
				$rootScope.$broadcast("renewalHistory");
			}, 100);
			
		}
	}
})