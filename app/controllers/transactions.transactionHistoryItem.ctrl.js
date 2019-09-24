angular.module('ppApp').controller('transactionHistoryItemCtrl', transactionHistoryItemCtrl);

transactionHistoryItemCtrl.$inject = ['$scope', 'transactionHistoryItem', 'transactionHistoryService']

function transactionHistoryItemCtrl($scope, transactionHistoryItem, transactionHistoryService) {

	var vm = this;

	$scope.$watch('$parent.filter', function(n, o){ //watch filter in parent state to display selected patent
		if(n !== undefined ) {
			if(n !== null) {
				$scope.transactionsFilter = n.patentUI.patentApplicationNumber;
			} else {
				$scope.transactionsFilter = null;
			}
		}
	});

	var currTransStatus = transactionHistoryItem.latestTransStatus;
	vm.transactionHistoryItem = transactionHistoryItem;	
	for(var i = 0; i < vm.transactionHistoryItem.serviceUIs.length; i++) {
		var item = vm.transactionHistoryItem.serviceUIs[i];
		item.serviceType = item.renewalFeeUI ? 'Regional Renewal' : 'Form 1200';
		item.serviceFeeUI = item.renewalFeeUI ? item.renewalFeeUI : item.form1200FeeUI;
	}
	var currTransStatus = transactionHistoryItem.latestTransStatus;
	vm.transactionHistoryItem = transactionHistoryItem;
	vm.renewalProgress = transactionHistoryService.renewalProgress(currTransStatus)
	vm.checkProgress = checkProgress;
	vm.patents = [];
	vm.transStatus = [
		{
			status: 'Initiated', 
			active: false, 
			complete: false,
			tip: 'You\'ve checked out your basket on the Patent Place, and we\'re now doing our work in the background.  We\'re now send the request over to our payment partners Moneycorp, requesting that they book the currency exchange, and to expect a payment from you.',
			position: 'top-left'
		}, 
		{
			status: 'Awaiting Funds', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have booked the currency exchange, and are now waiting for your payment.  They\'ll expect the funds by the date and time specified, and for it to have the correct reference on it so that the payment can be matched to the transation.',
			position: 'top-left'
		}, 
		{
			status: 'Funds Received', 
			active: false, 
			complete: false,
			tip: 'MoneyCorp have received your payment and they\'re now completing the foreign exchange.  This happens the day after your funds were expected by MoneyCorp.',
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
			tip: 'We\'ve have had confirmation that the funds have been received by the EPO.',
			position: 'top-right'
		}, 
		{
			status: 'EPO Instructed', 
			active: false, 
			complete: false,
			tip: 'Everything is in place, and we’ve instructed the EPO to renew the patent.',
			position: 'top-right'
		},
		{
			status: 'Completed', 
			active: false, 
			complete: false,
			tip: 'We\'ve had confirmation that your patent has been successfully renewed by the EPO.  You can download copies of the renewal certificate and the invoice from the Transaction history tab under the Transactions menu.',
			position: 'top-right'
		}
	];



	vm.$onInit = function() {

		if(transactionHistoryItem.hasFailed) {
			vm.hasFailed = true;
		}    			    			    			    			    		
	}

	function checkProgress() {

		var statusIndex;
		
		vm.transStatus.forEach(function(data, index){
			if(data.status == currTransStatus) {
				statusIndex = index;
			}
		});

		for(var i=0; i <= statusIndex; i++){
			if(transactionHistoryItem.hasFailed) {
				vm.transStatus[i].complete = true;
				if(currTransStatus == vm.transStatus[i].status) {
					vm.transStatus[i].failed = true;
					vm.transStatus[i].complete = false;
					vm.transStatus[i].active = true;
				}
			} else {
				vm.transStatus[i].complete = true;						
			}
		}

	};

}