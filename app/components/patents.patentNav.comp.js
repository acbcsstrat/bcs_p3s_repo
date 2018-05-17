angular.module('ppApp').component('patentnav', {
	template: function($stateParams) {
  	var navigation = $stateParams.navigation || 'default';
  	return '<div data-ng-include="\'app/templates/' + navigation + '.tpl.htm\'"></div>'
	}
});