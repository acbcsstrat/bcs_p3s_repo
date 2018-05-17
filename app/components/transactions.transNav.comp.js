angular.module('ppApp').component('transactionnav', {
  	template: function($stateParams) {
    	var navigation = $stateParams.navigation || 'default';
    	return '<div data-ng-include="\'app/templates/' + navigation + '.tpl.htm\'"></div>'
	}
});