angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl)

portfolioCtrl.$inject = ['$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter', 'organiseTextService', 'organiseColourService', '$mdPanel'];

function portfolioCtrl($scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter, organiseTextService, organiseColourService, $mdPanel) {

    var vm = this;

    $scope.promise = patentsRestService.fetchAllPatents();
    vm.outsideFilterStore = {};

    function select(i) {
        vm.selected = i;
    }

    select($stateParams.patentId)

    function uniqueArray(array) {
        return array.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
    }

    function rowSelect(event, patent){

        vm.stateParams = $stateParams;
        if($(event.target).hasClass('generateForm1200')) {
            $state.go('portfolio.modal.patent', {patentId: patent.patentID, form1200generate: 1, prepareGrant: 0}, {notify: false})
        }

        if($(event.target).hasClass('prepareGrant')) {
            $state.go('portfolio.modal.patent', {patentId: patent.patentID, prepareGrant: 1, form1200generate: 0}, {notify: false})
        }        

        if(!$(event.target).hasClass('cartbtn') && !$(event.target).hasClass('generateForm1200') && !$(event.target).hasClass('prepareGrant')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.modal.patent', {patentId: patent.patentID, form1200generate: null}, {notify: false})            
        }

    };

    function noSubFilter(obj) {
        for (var key in obj) {
            if (obj[key]) { //if one of the vm.outsideFilterStore ($scope.filter) properties evaluates to true (is selected) return false 
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

        for (var obj in vm.outsideFilterStore) { //vm.outsideFilterStore is populated by $scope.filter within the panel controller below. Scope filter properties are initiated from front-end. currentStageColour/serviceType

            if( vm.outsideFilterStore.hasOwnProperty(obj) ) {
                if (noSubFilter(vm.outsideFilterStore[obj])) continue; //Check if there are any sub filter options with the value of true, if so, break from loop to return value of true
                if (!checkArray(vm.outsideFilterStore, data.p3sServices, obj)) { //If the property from the data matches the property from vm.outsideFilterStore ($scope.filter) return false. It will not turn up in the table
                    matchesAND = false;
                    break; //break from the loop and return matchesAND which would now return false
                }
                
            }
        }
        // console.log(matchesAND)
        return matchesAND;
    }; 

    $scope.promise
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){

            if(!response.length) {
                vm.noPatents = true;
            }

            response.forEach(function(data){
                if(data.clientRef == '') {
                    data.clientRef = '[No Client Reference Provided]'
                }
            })

            vm.select = select;
            vm.selected = 0;
            vm.stateParams = $stateParams.patentId; 
            vm.rowSelect = rowSelect;
            $scope.portfolioLoaded = false;
            vm.sortReverse  = false;
            vm.selectedSortType = 'ep_ApplicationNumber';
            vm.showPanel = showPanel;
            vm.filtered = [];
            vm.portfolioData = response;
            vm.portfolioLoaded = true;

            function showPanel($event) {

                var panelPosition = $mdPanel.newPanelPosition()
                    .relativeTo($event.target)
                    .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
                // var panelAnimation = $mdPanel.newPanelAnimation()
                //     .openFrom($event.target)
                //     .duration(200)
                //     .closeTo('.show-button')
                //     .withAnimation($mdPanel.animation.SCALE);

                var config = {
                    attachTo: angular.element(document.body),
                    controller: ['mdPanelRef', '$scope', function(mdPanelRef, $scope) {

                        $scope.categories = ['serviceType', 'currentStageColour'];
                        $scope.filter = {};
                        vm.outsideFilterStore = $scope.filter;
                        $scope.portfolioData = response;
                        $scope.filtered = vm.filtered; //used for inital load of category items
                        $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
                            
                            return (array || []).map(function (w) {
                                return w.p3sServices[0][obj];
                            }).filter(function (w, idx, arr) {

                                if (typeof w === 'undefined') {
                                    return false;
                                }             
                                return arr.indexOf(w) === idx;
                            });
                        };

                        $scope.testChange = function(value) {
                            $timeout(function(argument) {
                                $scope.filtered = vm.filtered;
                            })
                            
                        }


                    }],
                    controllerAs: '$ctrl',
                    position: panelPosition,
                    // animation: panelAnimation,
                    targetEvent: $event,
                    templateUrl: 'app/templates/portfolio/filter-panel.tpl.htm',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    focusOnOpen: true
                };
                $mdPanel.open(config)
                .then(
                    function(result) {

                        panelRef = result;
                    },
                    function(error){
                        console.error('Error occured when opening panel: ',error)
                    }
                );
            }


            $scope.$broadcast('portfolioLoaded', function(){})

        }
    )
}