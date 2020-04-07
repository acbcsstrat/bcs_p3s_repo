angular.module('ppApp').controller('transactionItemCtrl', transactionItemCtrl);

transactionItemCtrl.$inject = ['transactionItem', 'transactionService', '$scope', '$state'];

function transactionItemCtrl(transactionItem, transactionService, $scope, $state) {

	var vm = this;
	var transStatusArray = ['Initiated', 'Awaiting Funds', 'Funds Received', 'Funds Sent', 'EPO Received', 'EPO Instructed', 'Completed'];
	var transStatusValidationArray = ['Initiated', 'Awaiting Funds', 'Processing Funds', 'Processing', 'Completed'];

	vm.setTab = setTab;
	vm.closeCaseoverview = closeCaseoverview;
	vm.caseoverview_tab = 'details';

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

    function closeCaseoverview() {
        $state.go('transactions', {}, {reload: false})
    }

    function setTab(tab) {
        vm.caseoverview_tab = tab;
    }

    function transItemStatus(val, status) {

    	var index;
    	if(val === true) {
    		index = transStatusValidationArray.indexOf(status);
	    	if(index < 3) {
	    		return 'Payment in progress'
	    	} else {
	    		return status;
	    	}    		
    	} else {
    		index = transStatusArray.indexOf(status);
	    	if(index < 5) {
	    		return 'Payment in progress'
	    	} else {
	    		return status;
	    	}        		
    	}

    }

    $scope.promise //assigned promise to scope so child state can also resolve this promise to invoke functions
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;;
    })
    .then(
    	function(response){

    		vm.transactionItem = transactionItem;

            var isValidation = transactionItem.serviceUIs.some(function(item){
                return item.newType == 'Validation' ? true : false;
            })
			vm.transactionItem.serviceUIs.map(function(item, index){
				item.transItemStatus = transItemStatus(isValidation, transactionItem.latestTransStatus);

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

					var obj1 = {
						status: 'Processing Funds', 
						active: false, 
						complete: false,
						tip: 'We are currently processing your funds',
						position: 'bottom-right'
					}

					var obj2 = {
						status: 'Processing', 
						active: false, 
						complete: false,
						tip: 'We are in the process of gathering and forwarding on the required documents to the appropriate European associates',
						position: 'bottom-right'
					}

					vm.transStatus.splice(3, 3);
					vm.transStatus.splice(3, 0, obj1);
					vm.transStatus.splice(4, 0, obj2);

					item.serviceType = 'validation'; 
					item.serviceFeeUI = item.validationFeeUI;
					item.allStates = item.validationFeeUI.designatedStates.concat(item.validationFeeUI.validationStates, item.validationFeeUI.extensionStates)
				}

				return item;

			})

			vm.checkProgress = checkProgress;
			vm.transactionLoaded = true;
		

    	}
    )

	function checkProgress() { //function to add statuses complete or active to view so it provides proggress bar to user

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
				if(transactionItem.latestTransStatus !== 'Completed') {
					vm.transStatus[i].complete = false;
				} else {
					vm.transStatus[i].active = false;
					vm.transStatus[i].complete = true;
				}
				
			}
		}
		
	};



}