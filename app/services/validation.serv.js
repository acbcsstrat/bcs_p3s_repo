angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q'];

function validationService($http, $q) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates
	}

	function fetchDesignatedStates() {

		var deferred = $q.defer()

		$http.get('/rest-validation-quote-request/', id)
		.then(
			function(response){
				deferred.resolve(response)
			},
			function(errResponse){
				console.error('Error return : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

	}

	return factory;

}