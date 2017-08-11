app.component('patentnav', {
  	template: function($stateParams) {
    	var navigation = $stateParams.navigation || 'default';
    	return '<div ng-include="\'p3sweb/app/components/patents/views/' + navigation + '.htm\'"></div>'
	}
});