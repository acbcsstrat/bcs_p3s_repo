'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
    	console.log("anytime here")
        $scope.ngCart = ngCart;
    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'p3sweb/app/components/checkout/views/ngCart/addtocart.htm';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;

                scope.inCart = function(){
                    return  ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'p3sweb/app/components/checkout/views/ngCart/cart.htm';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'p3sweb/app/components/checkout/views/ngCart/summary.htm';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }])

    .directive('ngcartCheckout', ['ngCart', 'ngCartItem', 'basketService', function(ngCart, ngCartItem, basketService){
        return {
            restrict : 'E',
            scope: {
                service:'@',
                settings:'=',
                ngModel: '='
            },
            controller : ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', 'basketService', function($rootScope, $scope, ngCart, fulfilmentProvider, basketService) {
                $scope.ngCart = ngCart;

                var vm = this;

                var productData = ngCart.$cart.items;

                $scope.checkout = function () {

                    var patent_ids = [];
                    var cartItems = {};
                    var totalCost = ngCart.totalCost();

                    Object.keys(productData).forEach(function(data){
                        cartItems = productData[data]._data;
                        patent_ids.push(cartItems.id);
                    })

                    var patentObj = {
                        patent_ids: patent_ids,
                        totalCostUSD: totalCost,
                        dateNowLocalTime :null
                    }
     
                    var billingDetails = $scope.billingDetails;
                    var orderObj =  {
                        billingCity: billingDetails.billingCity,
                        billingStreet: billingDetails.billingStreet,
                        billingState: billingDetails.billingState,
                        billingZip: billingDetails.billingZip,
                        firstName: billingDetails.firstName,
                        lastName: billingDetails.lastName,
                        totalCostUSD: totalCost,
                        patent_ids: patent_ids
                    }

                    
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    console.log("Here comes inside directive")
                    fulfilmentProvider.checkout(patentObj, orderObj)
                        .then(function (data, status, headers, config, $state, $timeout) {
                                $rootScope.$broadcast('ngCart', data);
                            },
                            function (data, status, headers, config) {
                                $rootScope.$broadcast('ngCart:checkout_failed', {
                                    statusCode: status,
                                    error: data
                                });
                            }
                        );
                }
            }]),
            link: function(scope, element, attrs) {

                ngCart.getItems();

                var cartArr = [];
                var cartItems = ngCart.getItems()

                cartItems.forEach(function(currentValue, index, array){
                    cartArr.push(currentValue._id)
                })

                var idObj = {
                    patent_id: cartArr
                };

                fetchBasketPatents(idObj);

                function fetchBasketPatents(obj) {

                    basketService.fetchBasketPatents(obj)
                    .then(
                        function(response){
                            
                            var patentArr = response.orderedPatentUIs;

                            scope.billingDetails = response;
                            scope.summary = {
                                date: response.dateNowLocalTimeUI,
                                patents: (function(){
                                    var patentAppNos = [];
                                    patentArr.forEach(function(patent){
                                        patentAppNos.push(patent.patentApplicationNumber)
                                    });
                                    return patentAppNos;
                                }()),
                                totalPatents: response.orderedPatentUIs.length,
                                totalCost: response.totalCostUSD
                            }

                            // var recentValue = {
                            //     id: (function(){
                            //         var patentIdArr = [];
                            //         patentArr.forEach(function(patent){
                            //             patentIdArr.push(patent.id)
                            //         })
                            //         return patentIdArr;
                            //     }()),
                            //     currentRenewalCost: (function(){
                            //         var costArr = [];
                            //         patentArr.forEach(function(patent){
                            //             costArr.push(patent.currentRenewalCost)
                            //         })
                            //         return costArr;                                 
                            //     }())
                            // }

                            // cartItems.forEach(function(currentValue, index, array){
                            //     if(currentValue._id = recentValue.id) {
                            //         currentValue._price = recentValue.currentRenewalCost[index];
                            //     } else {
                            //         currentValue._price = currentValue._price;
                            //     }
                            // })
                        },
                        function(errResponse){
                            console.log(errResponse)
                        }
                    );
                }
            },
            scope: {
                service:'@',
                settings:'=',
                ngModel: '='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'p3sweb/app/components/checkout/views/ngCart/checkout.htm';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);

    
