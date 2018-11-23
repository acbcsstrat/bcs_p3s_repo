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

.directive('ngcartCheckout', ['ngCart', 'ngCartItem', 'basketService', 'patentsRestService', '$rootScope', '$timeout', function(ngCart, ngCartItem, basketService, patentsRestService, $rootScope, $timeout){
    return {
        restrict : 'E',
        scope: {
            service:'@',
            settings:'=',
            ngModel: '='
        },
        controller : ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider', 'basketService', function($scope, ngCart, fulfilmentProvider, basketService) {

            $scope.ngCart = ngCart;
            console.log($scope.ngCart.getCart().items[0].getData())
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

                fulfilmentProvider.setService($scope.service);
                fulfilmentProvider.setSettings($scope.settings);
                fulfilmentProvider.checkout(patentObj, $scope.billingDetails)
                    .then(function (response, status, headers, config, $state, $timeout) {
                            $rootScope.$broadcast('ngCart', response);

                            var updatedPatentObj = {
                                totalCostUSD: response.data.totalCostUSD,
                                dateNowLocalTime: response.data.dateNowLocalTimeUI,
                                transTargetEndDateUI:response.data.transTargetEndDateUI,
                                patents: (function(){
                                    var patentAppNos = [];
                                    response.data.orderedPatentUIs.forEach(function(patent){
                                        patentAppNos.push(patent.patentApplicationNumber);
                                    });
                                    return patentAppNos;
                                }()),
                                totalPatents: response.data.orderedPatentUIs.length
                            };
                            $state.go('bank-transfer-preparation', {orderObj:order,patentObj:updatedPatentObj});                            
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

            var items = ngCart.getItems();
            var cartArr = items.map(function(el){
                return el._id
            })

            $rootScope.$on('ngCart:itemRemoved', function() {
                // fetchBasketPatents(cartArr);
                scope.summary.totalPatents = $scope.summary.totalPatents - 1; //a quick fix
            });

            function calcSummary(response) {

                var obj = {
                    officialFeeUSD: 0,
                    processingFeeUSD: 0,
                    extensionFeeUSD: 0,
                    urgentFeeUSD: 0,
                    expressFeeUSD: 0,
                    totalCost: 0,
                }

                response.forEach(function(el){
                    console.log(el)
                    if(el.renewalFeeUI !== null) {
                        obj.officialFeeUSD += el.renewalFeeUI.renewalFeeUSD;
                        obj.processingFeeUSD += el.renewalFeeUI.processingFeeUSD;
                        obj.extensionFeeUSD += el.renewalFeeUI.extensionFeeUSD;
                        obj.expressFeeUSD += el.renewalFeeUI.expressFeeUSD;
                        obj.urgentFeeUSD += el.renewalFeeUI.urgentFeeUSD;
                    }
                    if(el.form1200FeeUI !== null) {
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
                    }

                })
                return obj;
            }

            fetchBasketPatents(cartArr);

            function fetchBasketPatents(obj) {
                basketService.fetchBasketPatents(obj)
                .then(
                    function(response){
                        console.log(response)
                        var patentArr = response.orderedPatentUIs;

                        scope.billingDetails = {
                            billingStreet: response.billingStreet,
                            billingCity: response.billingCity,
                            billingState: response.billingState,
                            billingZip: response.billingZip,
                        }
                        scope.summary = {
                            date: response.dateNowLocalTimeUI,
                            fees: calcSummary(response),
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


