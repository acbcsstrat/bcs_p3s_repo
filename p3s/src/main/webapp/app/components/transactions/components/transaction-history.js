app.component('transactionHistory', {
	bindings: { transactionHistory: '<'},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history.htm',
	controller: function ($rootScope) {

		var vm = this;

		$rootScope.page = 'Transaction History';

      	vm.rowSelect = function(event){
      		if(!$(event.target).hasClass('cartbtn')) {
	      		var id = ($($(event.currentTarget).find('a')));
	      		var patentId = id[0].hash;
	      		window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
      		}
      	}
	}
});