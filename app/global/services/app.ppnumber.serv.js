export default angular.module('services.ppnumber-service', []).service('PpnumberService', PpnumberService).name;

PpnumberService.$inject = ['$q', '$http'];

function PpnumberService($q, $http) {

    var factory = {
        fetchNumber: fetchNumber
    }

    function fetchNumber(index) {

    	var deffered = $q.defer()

        $http.get(ppdomain+'partner-details/')
        .then(
        	function(response){
        		deffered.resolve(response.data)
        	},
        	function(errResponse){
        		console.error('Error fetch partner numners. Error :', errResponse)
        		deffered.reject(errResponse)
        	}
        )

        return deffered.promise
    }

    return factory;

}