angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q'];

function validationService($http, $q) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates,
		deleteQuote: deleteQuote,
		requestQuote: requestQuote,
		fetchPreparedQuote: fetchPreparedQuote
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

	function requestQuote(formData) {

		console.log('validation service: formdData ', formData)

		var deferred = $q.defer()

		$http.post('rest-validation-quote-request/', formData) //VALIDATION TEST DATA 
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

		var deferred = $q.defer()

		$http.get('rest-validation-quote/'+ id) //VALIDATION TEST DATA 
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
		console.log('deletequote, ', id)
		console.log('validation service deleteQuote: id', id)

		var deferred = $q.defer()

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