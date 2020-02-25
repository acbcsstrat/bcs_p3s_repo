angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q'];

function validationService($http, $q) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates,
		requestQuote: requestQuote
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

	function requestQuote(formData, config) {

		console.log(formData.entries())

		for (var pair of formData.entries()) {
		    console.log('validation service:formData : ', pair[0]+ ', ' + pair[1]); 
		}
		console.log('validation service: received config', config)
		var deferred = $q.defer()

		$http.post('rest-validation-quote-request/', formData, config) //VALIDATION TEST DATA 
		.then(
			function(response){
				console.log('validation service success response: ', response)
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