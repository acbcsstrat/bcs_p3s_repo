angular.module('ngCart.fulfilment', [])

.service('fulfilmentProvider', ['$injector', '$state', '$timeout', function($injector, $state, $timeout){

    this._obj = {
        service : undefined,
        settings : undefined
    };
  
    this.setService = function(service){
        this._obj.service = service;
    };
  
    this.setSettings = function(settings){
        this._obj.settings = settings;
    };
  
    this.checkout = function(orderObj){
        var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
        return provider.checkout(this._obj.settings,orderObj);
    };
      
}])

.service('ngCart.fulfilment.http', ['$http','$state', '$q', function($http, $state, $q){

        
        this.checkout = function(service, patent){

            var deferred = $q.defer();
            $http.post('http://localhost:8080/p3sweb/rest-prepare-banktransfer/', patent)
            .then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error submitting POST request to rest-prepare-banktransfer/. Error: ', errResponse)
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        };

 }]);



