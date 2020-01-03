'use strict';

angular.module('ngCart.directives', ['ngCart.fulfilment'])

.controller('CartController',['$scope', 'ngCart', '$state', function($scope, ngCart, $state) {
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
                return 'app/templates/ngCart/addtocart.htm';
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
        scope: {
            ngModel: '='
        },
        controller : 'CartController',
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'app/templates/ngCart/cart.htm';
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
                return 'app/templates/ngCart/summary.htm';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}])

.directive('ngcartCheckout', ['ngCart', 'ngCartItem', 'basketService', 'patentsRestService', '$rootScope', '$timeout',  '$state', function(ngCart, ngCartItem, basketService, patentsRestService, $rootScope, $timeout,  $state){
    return {
        restrict : 'E',
        scope: {
            service:'@',
            settings:'=',
            ngModel: '='
        },
        controller : ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider', 'basketService','$state', function($scope, ngCart, fulfilmentProvider, basketService, $state) {

            $scope.ngCart = ngCart;
            $scope.productData = ngCart.$cart.items;

            $scope.basketItems = [] = Object.keys($scope.productData).map(function(data, index){
                var obj = {};
                obj.ep_ApplicationNo = $scope.productData[data]._data.ep_ApplicationNumber;
                obj.patentID = $scope.productData[data]._data.patentID;
                obj.serviceType = $scope.productData[data]._name;
                return obj;
            });

            $scope.checkout = function () {


                var orderObj = {
                    basketItems: $scope.basketItems,
                    totalCostUSD: ngCart.totalCost()
                    // dateNowLocalTime :null
                };

                fulfilmentProvider.setService($scope.service);
                fulfilmentProvider.setSettings($scope.settings);
                fulfilmentProvider.checkout(orderObj)
                    .then(function (data, status, headers, config) {
                            data.billingDetails = $scope.summary.billingDetails;
                            $state.go('bank-transfer-preparation', {orderObj:orderObj, details: data}, {reload: false});                            
                        },
                        function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        }
                    );
            };
        }]),
        link: function(scope, element, attrs) {
            
            $rootScope.$on('ngCart:itemRemoved', function() {
               fetchBasketPatents();
            });

            fetchBasketPatents();

            function fetchBasketPatents() {

                var orderObj = {};
                orderObj.basketItems = scope.basketItems;
                basketService.fetchBasketPatents(orderObj)
                .then(
                    function(response){
                        scope.summary = {
                            firstName: response.firstName,
                            lastName: response.lastName,
                            billingDetails: {
                                billingStreet: response.billingStreet,
                                billingCity: response.billingCity,
                                billingState: response.billingState,
                                billingZip: response.billingZip,
                            },
                            date: response.dateNowLocalTimeUI,
                            fees: {
                                totalProcessingFeesUSD: response.totalProcessingFeesUSD,
                                totalExpressFeesUSD: response.totalExpressFeesUSD,
                                totalUrgentFeesUSD: response.totalUrgentFeesUSD,
                                totalOfficialFeesUSD: response.totalOfficialFeesUSD,
                                totalPatentPlaceFeesUSD: (function(){
                                    return response.totalCostUSD - response.totalOfficialFeesUSD;
                                }()),
                                totalCostUSD: response.totalCostUSD
                            },
                            totalPatents: response.orderedPatentUIs.length
                        };

                    },
                    function(errResponse){
                        console.error('Error: Unable to fetch basket details: ', errResponse);
                    }
                );
            }
        },
        transclude: true,
        templateUrl: function(element, attrs) {
            if ( typeof attrs.templateUrl == 'undefined' ) {
                return 'app/templates/ngCart/checkout.htm';
            } else {
                return attrs.templateUrl;
            }
        }
    };
}]);


