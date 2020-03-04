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
            data.serviceUIs.map(function(o, i){ 

                if(o.patentUI) {                
                    o.appAndType = o.patentUI.ep_ApplicationNumber + ' (' + o.newType +')';
                    if(o.patentUI.clientRef == '') {
                        o.patentUI.clientRef = '[No Client Reference Provided]'
                    }
                } else {
                    o.patentUI = {};
                    o.patentUI.clientRef = o.clientRef;
                    o.patentUI.ep_ApplicationNumber = o.patentApplicationNumber;
                    o.appAndType = o.patentUI.ep_ApplicationNumber  + ' (' + o.newType +')';
                    if(o.patentUI.clientRef == '') {
                        o.patentUI.clientRef = '[No Client Reference Provided]';
                    }
                }
            })
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
                        return dateA - dateB;
                    });
                }

            }());
            
            break;
            case 'clientRef':

                vm.sortClientRef = true;

                vm.selectedSortType = (function() {
                    vm.tableData.sort();
                }());
            
            break;
            case 'patentApplicationNumber':

                vm.sortPatentApplicationNumber = true;
                vm.selectedSortType = (function() {

                    if(vm.sortReverse === false) {
                        vm.tableData.sort(function(a, b){
                            var patentAppA = parseInt(a.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', '')), patentAppB = parseInt(b.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', ''));
                            return patentAppA - patentAppB;
                        });
                    } else {
                        vm.tableData.sort(function(a, b){
                            var patentAppA = parseInt(a.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', '')), patentAppB = parseInt(b.serviceUIs[0].patentUI.ep_ApplicationNumber.replace('EP', ''));
                            return patentAppA - patentAppB;
                        });
                    }
                }());
            
            break;
            case 'transAmount_USD':

                vm.sortTransCost = true;
                vm.selectedSortType = (function() {
                    if (vm.sortReverse === false) {
                        vm.tableData.sort(function(a, b){
                            var costA = a.transAmount_USD, costB = b.transAmount_USD;
                            return costA - costB;
                        });
                    } else {
                        vm.tableData.sort(function(a, b){
                            var costA = a.transAmount_USD, costB = b.transAmount_USD;
                            return costA - costB;
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

    function transactionListFilter(item, index) {

        var timestamp = new Date().getTime();

        vm.tableData.forEach(function(_ , idx) {
             if (index != idx) {
                 _.selectedUi = null;
             };
        });

        $scope.filter = { 
            selected: item,
            stamp: timestamp
        };

    }; 

    function noClientRef() {
        return true;
    }

    function displayTrans() {
        $state.go('transaction-history');
    };      

    function rowSelect(item, index, event){
        transactionListFilter(item, index)
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