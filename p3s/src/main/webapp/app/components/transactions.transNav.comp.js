angular.module('ppApp').component('transactionnav',{
  	template: ['$stateParams', function($stateParams) {
    	var navigation = $stateParams.navigation || 'default';
    	return '<div data-ng-include="\'app/templates/transactions/transactions.' + navigation + '.tpl.htm\'"></div>'
    }]
})
