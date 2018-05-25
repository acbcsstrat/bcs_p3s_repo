angular.module('ppApp').component('transactionnav', transactionnav);

transactionnav.$inject = ['$stateParams'];

export default function transactionnav($stateParams) {

    return {
      	template: function($stateParams) {
        	var navigation = $stateParams.navigation || 'default';
        	return '<div data-ng-include="\'app/templates/' + navigation + '.tpl.htm\'"></div>'
        }
    }
};