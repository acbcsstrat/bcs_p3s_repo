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

            var cartArr = [];
            var cartItems = ngCart.getItems();

            cartItems.forEach(function(currentValue, index, array){
                cartArr.push(currentValue._id);
            });

            var idObj = {
                patent_id: cartArr
            };

            $rootScope.$on('ngCart:itemRemoved', function() {
                // fetchBasketPatents(cartArr);
                scope.summary.totalPatents = scope.summary.totalPatents - 1; //a quick fix
            });

            function calcSummary(response) {

                var obj = {
                    officialFeeUSD: 0,
                    processingFeeUSD: 0,
                    extensionFeeUSD: 0,
                    urgentFeeUSD: 0,
                    expressFeeUSD: 0,
                    totalCostUSD: 0
                }

                response.forEach(function(el){  
                    if(el.renewalFeeUI !== null) {
                        obj.officialFeeUSD += el.renewalFeeUI.renewalFeeUSD;
                        obj.processingFeeUSD += el.renewalFeeUI.processingFeeUSD;
                        obj.extensionFeeUSD += el.renewalFeeUI.extensionFeeUSD;
                        obj.expressFeeUSD += el.renewalFeeUI.expressFeeUSD;
                        obj.urgentFeeUSD += el.renewalFeeUI.urgentFeeUSD;
                        obj.totalCostUSD += el.renewalFeeUI.subTotalUSD;
                    }
                    console.log('should hit', response)
                    if(el.form1200FeeUI !== null) {
                        console.log('hello')
                        obj.officialFeeUSD += el.renewalFeeUI.designationFeeUSD;
                        obj.officialFeeUSD += el.renewalFeeUI.examinationFeeUSD;
                        obj.officialFeeUSD += el.renewalFeeUI.excessPageFeeUSD;
                        obj.officialFeeUSD += el.renewalFeeUI.filingFeeUSD;
                        obj.officialFeeUSD += el.renewalFeeUI.supplementarySearchFeeUSD
                        obj.officialFeeUSD += el.renewalFeeUI.validationFeeUSD;                       
                        obj.processingFeeUSD += el.renewalFeeUI.processingFeeUSD;
                        obj.extensionFeeUSD += el.renewalFeeUI.extensionFeeUSD;
                        obj.expressFeeUSD += el.renewalFeeUI.expressFeeUSD;
                        obj.urgentFeeUSD += el.renewalFeeUI.urgentFeeUSD; 
                        obj.totalCostUSD += el.renewalFeeUI.subTotalUSD;
                    }

                })
                return obj;
            }

            fetchBasketPatents(idObj);

            function fetchBasketPatents(obj) {
                basketService.fetchBasketPatents(obj)
                .then(
                    function(response){
                        console.log(response)
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
                            fees: (function(){
                               return calcSummary(response.orderedPatentUIs);
                            }()),
                            totalPatents: response.orderedPatentUIs.length,
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
}]);

