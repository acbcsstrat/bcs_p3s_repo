angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q'];

function validationService($http, $q) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates,
		deleteQuote: deleteQuote,
		requestQuote: requestQuote,
		fetchPreparedQuote: fetchPreparedQuote,
		submitPoas: submitPoas
	}


	function submitPoas(formData) {

		var deferred = $q.defer()

		$http.post(ppdomain+'rest-validation-uploadPOA/', formData)
		.then(
			function(response){
				deferred.resolve(response);
			},
			function(errResponse){
				console.error('Error submitting poas. Error: ', errResponse)
				deferred.reject(errResponse)
			}
		)

		return deferred.promise;

	}	

	function fetchDesignatedStates(id) {

		var deferred = $q.defer()

		$http.get(ppdomain+'rest-validation-quote-request/'+id) //VALIDATION TEST DATA 
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

	function requestQuote(formData) {

		console.log('validation service: formdData ', formData)

		var deferred = $q.defer();

		$http.post(ppdomain+'rest-validation-quote-request/', formData) //VALIDATION TEST DATA 
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

	function fetchPreparedQuote(id) {

		console.log('validation service fetchPreparedQuote: id', id)

		var deferred = $q.defer();

		$http.get(ppdomain+'rest-validation-quote/'+ id) //VALIDATION TEST DATA 
		.then(
			function(response){
				console.log('validation service fetchPreparedQuote success response: ', response)
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service fetchPreparedQuote : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}		

	function deleteQuote(id) {

		var deferred = $q.defer();

		$http.delete('rest-validation-quote/'+ id) //VALIDATION TEST DATA 
		.then(
			function(response){
				console.log('validation service deleteQuote success response: ', response)
				deferred.resolve(response.data)
			},
			function(errResponse){
				console.error('Error returning validation service deleteQuote : ', errResponse)
				deferred.reject(errResponse)
			}	
		)

		return deferred.promise;

	}	

	return factory;

}