app.component('basket', {
	templateUrl: 'p3sweb/app/components/checkout/views/basket.htm',
	controller: ['basketService', 'ngCart', 'fulfilmentProvider', '$rootScope', '$state',  '$scope', function(basketService, ngCart, fulfilmentProvider, $rootScope, $state, $scope) {

		var vm = this;

		$rootScope.page = 'Basket';

        

	}
]})

.directive('validateAddress', function(){

    var regExp = /^[a-zA-z0-9\s\-\(\).,]*$/;

    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            
            var modelController = elem.controller('ngModel');

            function myValidation(value) {
                if (regExp.test(value)) {

                    modelController.$setValidity('validAddress', true);
                } else {
                    modelController.$setValidity('validAddress', false);
                }
                return value;
            }
            ctrl.$parsers.push(myValidation);
        }        
    }    

})