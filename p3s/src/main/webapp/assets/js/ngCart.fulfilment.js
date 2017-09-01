
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
            this.toTransferConfirm(patentObj, orderObj);
            return provider.checkout(this._obj.settings,patentObj ,orderObj);
        }

        this.toTransferConfirm = function (patentObj, orderObj) {
            $timeout(function() {
                $state.go('bank-transfer-preparation', {orderObj: orderObj})
            }, 200);
        }
      
    }])




.service('ngCart.fulfilment.http', ['$http','$state', '$q', function($http, $state, $q){

        
        this.checkout = function(service, patent,order){
        	
        	console.log("actual POst method")

            var obj = {
                totalCostUSD: patent.totalCostUSD,
                patent_ids: patent.patent_ids
            }
            
            var deferred = $q.defer();
            $http.post('http://localhost:8080/p3sweb/rest-prepare-banktransfer/', obj)
            .then(
                function(response){
                	console.log("Inside success of POST")
                    deferred.resolve(response.data)
                    console.log(response.data.totalCostUSD)
                   var updatedPatentObj = {
                        totalCostUSD: response.data.totalCostUSD,
                        dateNowLocalTime: response.data.dateNowLocalTimeUI,
                        transTargetEndDateUI:response.data.transTargetEndDateUI,
                        /*patents: (function(){
                            var patentAppNos = [];
                            patentArr.forEach(function(patent){
                                patentAppNos.push(patent.patentApplicationNumber)
                            });
                            return patentAppNos;
                        }()),*/
                        totalPatents: response.data.orderedPatentUIs.length
                    }
                         
                	console.log("before leaving to js")
                	console.log(updatedPatentObj)
                	console.log(order)
                	$state.go('bank-transfer-preparation', {orderObj:order,patentObj:updatedPatentObj})
                },
                function(errResponse){  
                    deferred.reject(errResponse)
                }
            )

            return deferred.promise;
        }
 }])



