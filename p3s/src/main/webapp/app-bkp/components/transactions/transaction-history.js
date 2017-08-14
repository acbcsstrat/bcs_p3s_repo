app.component('transactionHistory', {
	bindings: { transactionHistory: '<'},
	templateUrl: 'p3sweb/app/components/transactions/views/transaction-history.htm'
	// controller: ['transactionHistoryService', function(transactionHistoryService){

	// 	var vm = this;

	// 	transactionHistoryService.fetchTransactionHistory()
	// 	.then(
	// 		function(response){

	// 			console.log(response)
	// 			// vm.patentArr = [];

	// 			// $.each(patent, function(i, item){
	// 			// 	$.each(item, function(key, value){
	// 			// 		if(key == 'patentUI') {
	// 			// 			var item = value.patentApplicationNumber
	// 			// 			vm.patentArr.push({item})
	// 			// 			console.log(vm.patentArr)
	// 			// 		}
	// 			// 	})
	// 			// })
	// 		},
	// 		function(){

	// 		})

	// }]
});