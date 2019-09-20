'use strict';

import fulfilment from '../../services/vendors/ngCart.fulfilment.js';

export default angular.module('ngCart.directives', [fulfilment])

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
            var productData = ngCart.$cart.items;

            $scope.checkout = function () {

                var patent_ids = [];
                var cartItems = {};
                var totalCost = ngCart.totalCost();

                Object.keys(productData).forEach(function(data){
                    cartItems = productData[data]._data;
                    patent_ids.push(cartItems.id);
                });

                var patentObj = {
                    patent_ids: patent_ids,
                    totalCostUSD: totalCost,
                    dateNowLocalTime :null
                };

                var billingDetails = $scope.summary.billingDetails;
                fulfilmentProvider.setService($scope.service);
                fulfilmentProvider.setSettings($scope.settings);
                fulfilmentProvider.checkout(patentObj)
                    .then(function (data, status, headers, config) {
                            data.billingDetails = billingDetails;
                            $state.go('bank-transfer-preparation', {orderObj:data}, {reload: false});                            
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




            var cartArr = function() {
                var cartArr = [];
                var cartItems = ngCart.getItems();

                cartItems.forEach(function(currentValue, index, array){
                    cartArr.push(currentValue._id);
                });

                var idObj = {
                    patent_id: cartArr
                };

                return idObj;
            }

            $rootScope.$on('ngCart:itemRemoved', function() {
               fetchBasketPatents();
            });

            fetchBasketPatents();

            function fetchBasketPatents() {
                var patent_ids = cartArr();

                basketService.fetchBasketPatents(patent_ids)
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
                        console.log(errResponse);
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
}]).name


