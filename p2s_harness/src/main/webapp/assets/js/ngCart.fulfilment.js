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
            $http.post('http://localhost:8080/harness/rest-prepare-banktransfer/', obj)
            .then(
                function(response){
                    deferred.resolve(response.data);
                    var patentArr = response.data.orderedPatentUIs;
                    var updatedPatentObj = {
                        totalCostUSD: response.data.totalCostUSD,
                        dateNowLocalTime: response.data.dateNowLocalTimeUI,
                        transTargetEndDateUI:response.data.transTargetEndDateUI,
                        patents: (function(){
                            var patentAppNos = [];
                            patentArr.forEach(function(patent){
                                patentAppNos.push(patent.patentApplicationNumber);
                            });
                            return patentAppNos;
                        }()),
                        totalPatents: response.data.orderedPatentUIs.length
                    };
                    $state.go('bank-transfer-preparation', {orderObj:order,patentObj:updatedPatentObj});
                },
                function(errResponse){  
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        };
 }]);



