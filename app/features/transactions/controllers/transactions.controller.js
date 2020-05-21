TransactionsController.$inject = ['TransactionService', '$scope', '$q', '$state', '$timeout'];

export default function TransactionsController(TransactionService, $scope, $q, $state, $timeout) {

    var vm = this;

    vm.transactions = null;

    $scope.filter = {};     
    function noSubFilter(obj) {
        for (var key in obj) {
            if (obj[key]) { //if one of the $scope.filter ($scope.filter) properties evaluates to true (is selected) return false 
                return false;
            }
        }
        return true; //if no subfilters return true. This will result in all filtered data items being returned a true value
    }

    function checkArray(obj, service, prop) {
        return service.some(function(item) { //if filter[curretStageColour][red]
            return obj[prop][item[prop]] === true;
        })
    }

    $scope.filterByPropertiesMatchingAND = function (data) { //all data sent from filter 
        var matchesAND = true; //set macthes to true (default)
        for (var obj in $scope.filter) { //$scope.filter is populated by $scope.filter within the panel controller below. Scope filter properties are initiated from front-end. currentStageColour/serviceType
            if( $scope.filter.hasOwnProperty(obj) ) {
                if (noSubFilter($scope.filter[obj])) continue; //Check if there are any sub filter options with the value of true, if so, break from loop to return value of true
                if (!$scope.filter[obj][data[obj]]) { //If the property from the data matches the property from $scope.filter ($scope.filter) return false. It will not turn up in the table
                    matchesAND = false;
                    break; //break from the loop and return matchesAND which would now return false
                }
                
            }
        }
        return matchesAND;
    };

    $scope.promise = TransactionService.fetchAllTransactions()
    $scope.promise.then(
        function(response){

            $scope.transactions = response;
            
            vm.sortBy = sortBy;
            vm.rowSelect = rowSelect;
            vm.select = select;
            vm.showFilter = showFilter;
            vm.selectedSortType = 'p3S_TransRef';   
            vm.updateFiltered = updateFiltered;
            vm.chipOptions = [];                        
            $scope.selectedChip = selectedChip;

            $scope.transactionsLoaded = true;

            function sortBy(propertyName) {
                vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
                vm.propertyName = propertyName;
            };

            function select(i) {
                vm.selected = i;
            }            

            function rowSelect(event, transaction){
                $state.go('transactions.modal.transaction-item', {transId: transaction.p3s_TransRef})
            };          

            function selectedChip(prop, value, cat) {
                $scope.filter[cat][prop] = false;
            }

            function updateFiltered(prop, value, cat) {
                if(value === true) {
                    vm.chipOptions.push({cat: cat, value: value, prop: prop})
                } 
                if(value === false) {
                    var index = vm.chipOptions.indexOf(cat);
                    vm.chipOptions.splice(index, 1);
                }
            }

            function showFilter(mdMenu, $event) {
                mdMenu.open($event)
                $scope.categories = ['transTypeUI', 'latestTransStatus'];     

                //return items to filter panel
                $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
                    return (array || []).map(function (w) {
                        return w[obj]; //select property in p3sservices 
                    }).filter(function (w, idx, arr) {
                        if (typeof w === 'undefined') {
                            return false;
                        }
                        return arr.indexOf(w) === idx;
                    });
                };


                $scope.closeDialog = function() {
                    $mdDialog.hide();                            
                }

            } //showFilter function end         

        }

    )


}