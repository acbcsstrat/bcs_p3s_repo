angular.module('ppApp').controller('basketCtrl', basketCtrl);

basketCtrl.$inject = ['$rootScope'];

function basketCtrl($rootScope) {

   $rootScope.page = 'Basket';

}

