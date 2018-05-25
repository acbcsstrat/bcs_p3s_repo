angular.module('ppApp').component('patentnav', patentnav);

patentnav.$inject = ['$stateParams'];

export default function patentnav($stateParams) {

    return {
    	template: function($stateParams) {
      	var navigation = $stateParams.navigation || 'default';
      	return '<div data-ng-include="\'app/templates/patents.' + navigation + '.tpl.htm\'"></div>'
    	}
    }
};