angular.module('ppApp').controller('basketCtrl', basketCtrl);

basketCtrl.$inject = ['$rootScope'];

function basketCtrl($rootScope) {

	var vm = this;

   	vm.pageTitle = 'Basket';

}

