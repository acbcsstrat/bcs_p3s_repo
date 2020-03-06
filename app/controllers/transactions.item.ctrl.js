angular.module('ppApp').controller('transactionItemCtrl', transactionItemCtrl);

transactionItemCtrl.$inject = ['transactionItem', 'transactionService', '$scope'];

function transactionItemCtrl(transactionItem, transactionService, $scope) {

	var vm = this;

	$scope.transactionsFilter = {};

	$scope.$watch('$parent.filter', function(n, o){ //watch filter in parent state to display selected patent
		$scope.transactionsFilter = {};
		if(n !== undefined ) { //check if value has been selected
			if(n.selected.selectedUi && n.selected.selectedUi !== null) {
				$scope.transactionsFilter.appAndType =  n.selected.selectedUi.appAndType;
			} else {
				$scope.transactionsFilter = {}; //reset filter
			}
		}
	});

	var currTransStatus = transactionItem.latestTransStatus;
	vm.transactionItem = transactionItem;

	for(var i = 0; i < vm.transactionItem.serviceUIs.length; i++) {
		var item = vm.transactionItem.serviceUIs[i];
		if(item.renewalFeeUI) { 
			item.serviceType = 'renewal'; 
			item.serviceFeeUI = item.renewalFeeUI; 
		}
		if(item.form1200FeeUI) { 
			item.serviceType = 'Euro-PCT'; 
			item.serviceFeeUI = item.form1200FeeUI; 
		}
		if(item.grantFeeUI) { 
			item.serviceType = 'grant'; 
			item.serviceFeeUI = item.grantFeeUI; 
		}

		if(item.validationFeeUI) { 
			item.serviceType = 'validation'; 
			item.serviceFeeUI = item.validationFeeUI; 
		}		

	}

	vm.checkProgress = checkProgress;
	vm.patents = [];
	vm.transStatus = [
		{
			status: 'Initiated', 
			active: false, 
			complete: false,
			tip: 'You\'ve checked out your basket on the Patent Place, and we\'re now doing our work in the background. We will now send the request over to our payment partners Moneycorp, requesting that they book the currency exchange, and to expect a payment from you.',
			position: 'top-left'
		}, 
		{
			status: 'Awaiting Funds', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have booked the currency exchange, and are now waiting for your payment. They\'ll expect the funds by the date and time specified, and for it to have the correct reference on it so that the payment can be matched to the transation.',
			position: 'top-left'
		}, 
		{
			status: 'Funds Received', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have received your payment and they\'re now completing the foreign exchange. This happens the day after your funds were expected by MoneyCorp.',
			position: 'top-left'
		},
		{
			status: 'Funds Sent', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have completed the currency exchange and the Euros have been sent to the European Patent Office.',
			position: 'top-right'
		},
		{
			status: 'EPO Received', 
			active: false, 
			complete: false,
			tip: 'We\'ve had confirmation that the funds have been received by the EPO.',
			position: 'top-right'
		}, 
		{
			status: 'EPO Instructed', 
			active: false, 
			complete: false,
			tip: 'Everything is in place, and we’ve instructed the EPO.',
			position: 'top-right'
		},
		{
			status: 'Completed', 
			active: false, 
			complete: false,
			tip: 'We\'ve had confirmation that your transaction has been completed. You can download a copy of the invoice or any relevant certificate below.',
			position: 'top-right'
		}
	];

	vm.$onInit = function() {
		console.log('hello', transactionItem)
		switch(transactionItem.latestTransStatus) { //add current transaction progress value to scope

			case 'Initiated':
				vm.transactionProgress = 0;
			break;
			case 'Awaiting Funds':
				vm.transactionProgress = 17.28;
			break;
			case 'Funds Received':
				vm.transactionProgress = 34.56;	
			break;
			case 'Funds Sent':
				vm.transactionProgress = 51.84;	
			break;
			case 'EPO Received':
				vm.transactionProgress = 69.12;
			break;
			case 'EPO Instructed':
				vm.transactionProgress = 86.4;
			break;
			case 'Completed':
				vm.transactionProgress = 100;	    			    			    			    			    		
		}

	}
	
	function checkProgress() {

		var statusIndex;

		vm.transStatus.forEach(function(data, index){
			if(data.status == currTransStatus) {
				statusIndex = index; //find current active status
			}
		});

		for(var i=0; i <= statusIndex; i++){
			vm.transStatus[i].complete = true; //change property complete to true to all items
			if(currTransStatus == vm.transStatus[i].status) { //until it matches current tran statues
				vm.transStatus[i].active = true; // change active property value to true
				vm.transStatus[i].complete = false;
			}
		}
		
	};



}