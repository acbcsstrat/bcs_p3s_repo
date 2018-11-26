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
  
    this.checkout = function(patentObj, orderObj){
        var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
        return provider.checkout(this._obj.settings,patentObj ,orderObj);
    };
      
}])

.service('ngCart.fulfilment.http', ['$http','$state', '$q', function($http, $state, $q){

        
        this.checkout = function(service, patent,order){

            var obj = {
                totalCostUSD: patent.totalCostUSD,
                patent_ids: patent.patent_ids
            };
            
            var deferred = $q.defer();
            $http.post('http://localhost:8080/p3sweb/rest-prepare-banktransfer/', obj)
            .then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){  
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        };
 }]);



