angular.module('ppApp').factory('validationService', validationService);

validationService.$inject = ['$http', '$q', 'Upload'];

function validationService($http, $q, Upload) {

	var factory = {
		fetchDesignatedStates: fetchDesignatedStates,
		deleteQuote: deleteQuote,
		requestQuote: requestQuote,
		fetchPreparedQuote: fetchPreparedQuote,
		submitPoas: submitPoas,
		poaUploadSuccessNotify: poaUploadSuccessNotify,
		poaUploadFailNotify: poaUploadFailNotify
	}

	function poaUploadSuccessNotify(id) {
		console.log(id)
		$http.post(ppdomain+'rest-validation-uploadPOACompleted/'+id)
	}

	function poaUploadFailNotify(id) {
		console.log(id)
		$http.post(ppdomain+'rest-validation-uploadPOAFailed/'+id)
	}	


	function submitPoas(id, data) {

		var deferred = $q.defer();
		console.log(id, data)
        Upload.upload({
            url: ppdomain+'rest-validation-uploadPOA/',
            data:{ 
                patentID: id,
                stateCode: data.stateCode,
                signedPoaDoc: data.signedPoaDoc
            },
            arrayKey: ''
        }).then(function (response) {
        	console.log('service good', response)

                deferred.resolve(response)

        }, function (errResponse) {
        	console.log('service bad', errResponse)
            deferred.reject(errResponse)
        });

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