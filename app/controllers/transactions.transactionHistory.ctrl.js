angular.module('ppApp').controller('transactionHistoryCtrl', transactionHistoryCtrl);

transactionHistoryCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$state', 'transactionHistory', 'transactionHistoryService']

function transactionHistoryCtrl($rootScope, $scope, $timeout, $state, transactionHistory, transactionHistoryService) {

    var vm = this;

    vm.pageTitle = 'Transaction History';

    var loadTimeout = $timeout(function() {
        vm.transactionsLoaded = true;
    }, 300);

    vm.tableData = transactionHistory;
    vm.patentAppData = { defaultSelect: null };
    vm.clientRefData = { defaultSelect: null };
    vm.sortType  = sortType; // set the default sort type
    vm.sortReverse  = false;  // set the default sort order
    vm.transactionListFilter = transactionListFilter;
    vm.noClientRef = noClientRef;
    vm.displayTrans = displayTrans;
    vm.rowSelect = rowSelect;
    vm.selectedSortType = 'p3S_TransRef';
   

    function init() {

        transactionHistory.forEach(function(data){
            if(data.serviceUIs.length > 1) {
                data.serviceUIs.map(function(o, i){ 
                    if(o.patentUI.clientRef == '') {
                        o.patentUI.clientRef = '[No Client Reference Provided]'
                    }
                })                  
            }

        })    

        transactionHistory.map(function(o, i){
            o.actionProgress = transactionHistoryService.actionProgress(o.latestTransStatus);
        })

    }

    init();

    function sortType(column) {


        vm.sortTransCost = false;
        vm.sortPatentApplicationNumber = false;
        vm.sortClientRef = false;
        vm.sortTransDate = false;
        vm.sortTransItems = false;
        vm.selectedSortType = column;  

        switch(column) {
            case 'transStartDate':

            vm.sortTransDate = true;
            vm.selectedSortType = (function() {

                if (vm.sortReverse === false) {

                    vm.tableData.sort(function(a, b){
                        var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
                        return dateB - dateA;
                    });

                } else {
                    vm.tableData.sort(function(a, b){
                        var dateA = new Date(a.transStartDate), dateB = new Date(b.transStartDate);
                        return dateB - dateA;
                    });
                }

            }());
            
            break;
            case 'clientRef':

                vm.sortClientRef = true;
                vm.selectedSortType = (function() {

                    var result = []

                    var arrayOrder = [];

                    vm.tableData.forEach(function(data) {
                        
                        data.renewalUIs.map(function(o, i){ 
                            arrayOrder.push(o.patentUI.clientRef);
                        })

                    })

                    arrayOrder.sort();

                    arrayOrder.forEach(function(key){

                        var found = false;

                        vm.tableData = vm.tableData.filter(function(item){
                            if(item.renewalUIs.length === 1) {
                                if(!found && item.renewalUIs[0].patentUI.clientRef == key) {
                                    result.push(item)
                                    found = true;
                                    return false;                                   
                                } else {
                                    return true;
                                }
                            } else {
                                result.push(item)
                            }                  

                        })

                    })

                    vm.tableData = result;
                })
            
            break;
            case 'patentApplicationNumber':

                vm.sortPatentApplicationNumber = true;
                vm.selectedSortType = (function() {

                    var result = []

                    var arrayOrder = [];

                    vm.tableData.forEach(function(data) {
                        
                        data.renewalUIs.map(function(o, i){ 
                            arrayOrder.push(o.patentUI.patentApplicationNumber);
                        })
                  
                    })

                    arrayOrder.sort();

                    arrayOrder.forEach(function(key){

                        var found = false;

                        vm.tableData = vm.tableData.filter(function(item){
                            
                            if(item.renewalUIs.length === 1) {
                                if(!found && item.renewalUIs[0].patentUI.patentApplicationNumber == key) {
                                    result.push(item)
                                    found = true;
                                    return false;                                   
                                } else {
                                    return true;
                                }
                            } else {
                                result.push(item)
                            }                        

                        })

                    })

                    vm.tableData = result;

                })
            
            break;
            case 'transAmount_USD':

                vm.sortTransCost = true;
                vm.selectedSortType = (function() {
                    if (vm.sortReverse === false) {
                        vm.tableData.sort(function(a, b){
                            var costA = a.transAmount_USD, costB = b.transAmount_USD;
                            return costB - costA;
                        });
                    } else {
                        vm.tableData.sort(function(a, b){
                            var costA = a.transAmount_USD, costB = b.transAmount_USD;
                            return costB - costA;
                        });
                    }
                    }());
            
            break;
            case 'transLength':

                vm.sortTransItems = true;
                vm.selectedSortType = (function() {
                    if (vm.sortReverse === false) {
                        vm.tableData.sort(function(a, b){
                            var actionA = a.serviceUIs.length, actionB = b.serviceUIs.length;
                            return actionB - actionA;
                        });        
                    } else {
                        if(vm.sortReverse === true) {
                            vm.tableData.sort(function(a, b){
                                var actionA = a.serviceUIs.length, actionB = b.serviceUIs.length;
                                return actionB - actionA;
                            });
                        }
                    }
                }());
            break;                      
            
        }

    };

    function transactionListFilter(data, filter, i) {

        if(filter == 'clientRefFilter') { //reset altenrate select option
            $scope.filter = data;
            vm.patentAppData.defaultSelect = null;
        } else {
            $scope.filter = data;
            vm.clientRefData.defaultSelect = null;
        }

    };

    function noClientRef() {
        return true;
    }

    function displayTrans() {
        $state.go('transaction-history');
    };      

    function rowSelect(event){
        vm.transInfoContent = true;
        if(!$(event.target).hasClass('cartbtn')) {
            var id = ($($(event.currentTarget).find('a')));
            var patentId = id[0].hash;
            window.location = 'http://localhost:8080/p3sweb/index.htm'+patentId;
        }
    };

    $scope.$on('$destroy', function(){
        $timeout.cancel(loadTimeout)
    })    
    
}