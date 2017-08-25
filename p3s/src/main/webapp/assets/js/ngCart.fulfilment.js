
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
            console.log(patentObj)
            console.log(orderObj)
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
            this.toTransferConfirm(patentObj, orderObj);
            return provider.checkout(this._obj.settings, patentObj);

        }

        this.toTransferConfirm = function (patentObj, orderObj) {
            $timeout(function() {
                $state.go('bank-transfer-preparation', {patentObj: patentObj, orderObj: orderObj})
            }, 200);
        }

    }])


// .service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart){

//         this.checkout = function(service, order){

//             console.log(order)

//             var deferred = $q.defer();

//             $log.info(ngCart.toObject());
//             deferred.resolve({
//                 cart:ngCart.toObject()
//             });

//             return deferred.promise;

//         }

//  }])

.service('ngCart.fulfilment.http', ['$http', 'ngCart', '$q', function($http, ngCart, $q){

        
        this.checkout = function(service, order){
            
            // var cartItems = ngCart.getItems()            
            // cartItems.forEach(function(currentValue, index, array){
            //     currentValue._price = 144;
            // })
            console.log('hello')
            var obj = {
                totalCostUSD: order.totalCostUSD,
                patent_ids: order.patent_ids
            }
            
            var deferred = $q.defer();
            $http.post('http://localhost:8080/p3sweb/rest-prepare-banktransfer/', obj)
            .then(
                function(response){
                    console.log(response)
                    deferred.resolve(response.data)
                },
                function(errResponse){  
                    deferred.reject(errResponse)
                }
            )

            return deferred.promise
        }
 }])


// .service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function($http, ngCart){


// }]);
