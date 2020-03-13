angular.module('ppApp').controller('transactionItemCtrl', transactionItemCtrl);

transactionItemCtrl.$inject = ['transactionItem', 'transactionService', '$scope', '$state'];

function transactionItemCtrl(transactionItem, transactionService, $scope, $state) {

	var vm = this;
	var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	vm.setTab = setTab;
	vm.closeCaseoverview = closeCaseoverview;
	vm.caseoverview_tab = 'details';

    function closeCaseoverview() {
        $state.go('transactions', {}, {reload: false})
    }

	function transProgress(status) {
		var index = transStatusArray.indexOf('Funds Received');
		var pecentage = (index * 100) / 7; 
		return pecentage;
	}

    function setTab(tab) {
        vm.caseoverview_tab = tab;
    }

    function transItemStatus() {

    }

    $scope.promise //assigned promise to scope so child state can also resolve this promise to invoke functions
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response[0].concat(response[1]);
    })
    .then(
    	function(response){
    		vm.transactionLoaded = true;
    		vm.transactionItem = transactionItem;
    		vm.transactionItem.transItemStatus = 
    		vm.transactionProgress = $scope.transactionProgress(transactionItem.latestTransStatus)
			vm.transactionItem.serviceUIs.map(function(item){

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
			})

			vm.checkProgress = checkProgress;
			vm.patents = [];
			vm.transStatus = [
				{
					status: 'Initiated', 
					active: false, 
					complete: false,
					tip: 'You\'ve checked out your basket on the Patent Place, and we\'re now doing our work in the background. We will now send the request over to our payment partners Moneycorp, requesting that they book the currency exchange, and to expect a payment from you.',
					position: 'bottom-left'
				}, 
				{
					status: 'Awaiting Funds', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have booked the currency exchange, and are now waiting for your payment. They\'ll expect the funds by the date and time specified, and for it to have the correct reference on it so that the payment can be matched to the transation.',
					position: 'bottom-left'
				}, 
				{
					status: 'Funds Received', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have received your payment and they\'re now completing the foreign exchange. This happens the day after your funds were expected by MoneyCorp.',
					position: 'bottom-left'
				},
				{
					status: 'Funds Sent', 
					active: false, 
					complete: false,
					tip: 'MoneyCorp have completed the currency exchange and the Euros have been sent to the European Patent Office.',
					position: 'bottom-right'
				},
				{
					status: 'EPO Received', 
					active: false, 
					complete: false,
					tip: 'We\'ve had confirmation that the funds have been received by the EPO.',
					position: 'bottom-right'
				}, 
				{
					status: 'EPO Instructed', 
					active: false, 
					complete: false,
					tip: 'Everything is in place, and we’ve instructed the EPO.',
					position: 'bottom-right'
				},
				{
					status: 'Completed', 
					active: false, 
					complete: false,
					tip: 'We\'ve had confirmation that your transaction has been completed. You can download a copy of the invoice or any relevant certificate below.',
					position: 'bottom-right'
				}
			];

			

    	}
    )

	function checkProgress() {

		var statusIndex;

		vm.transStatus.forEach(function(data, index){
			if(data.status == transactionItem.latestTransStatus) {
				statusIndex = index; //find current active status
			}
		});

		for(var i=0; i <= statusIndex; i++){
			vm.transStatus[i].complete = true; //change property complete to true to all items
			if(transactionItem.latestTransStatus == vm.transStatus[i].status) { //until it matches current tran statues
				vm.transStatus[i].active = true; // change active property value to true
				vm.transStatus[i].complete = false;
			}
		}
		
	};



}