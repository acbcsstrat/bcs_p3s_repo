angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q'];

function validationService($http, $q) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates
	}

	function fetchDesignatedStates(id) {

		var deferred = $q.defer()

		$http.get('rest-validation-quote-request/'+id) //VALIDATION TEST DATA 
		.then(
			function(response){
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}

	return factory;

}