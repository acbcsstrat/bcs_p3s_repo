app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: function() {

		var vm = this;

	   	vm.sortType     = 'patentApplicationNumber'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order
	}
});