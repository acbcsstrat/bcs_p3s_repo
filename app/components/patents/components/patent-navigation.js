app.component('patentnav', {
  	template: function($stateParams) {
    	var navigation = $stateParams.navigation || 'default';
    	return '<div data-ng-include="\'p3sweb/app/components/patents/views/' + navigation + '.htm\'"></div>'
	}
});