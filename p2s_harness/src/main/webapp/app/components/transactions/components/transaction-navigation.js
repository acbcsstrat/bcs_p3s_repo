app.component('transactionnav', {
  	template: function($stateParams) {
    	var navigation = $stateParams.navigation || 'default';
    	return '<div ng-include="\'p3sweb/app/components/transactions/views/' + navigation + '.htm\'"></div>'
	}
});