angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl)

portfolioCtrl.$inject = ['$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter', 'organiseTextService', 'organiseColourService', '$mdPanel'];

function portfolioCtrl($scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter, organiseTextService, organiseColourService, $mdPanel) {

    var vm = this;
    vm.pageTitle = 'Portfolio';
    $scope.promise = patentsRestService.fetchAllPatents();
    vm.select = select;
    vm.selected = 0;
    vm.stateParams = $stateParams.patentId; 
    vm.rowSelect = rowSelect;
    $scope.portfolioLoaded = false;
    vm.date = new Date();
    vm.panelActive = true; 
    vm.sortReverse  = false;
    vm.selectedSortType = 'ep_ApplicationNumber';
    vm.showPanel = showPanel;
    vm.portfolioData = [];
    vm.filtered = [];
    vm.filteredChips = []
    var outsideFilterStore;
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
            $state.go('portfolio.patent', {patentId: patent.patentID, form1200generate: 1, prepareGrant: 0}, {notify: false})
        }

        if($(event.target).hasClass('prepareGrant')) {
            $state.go('portfolio.patent', {patentId: patent.patentID, prepareGrant: 1, form1200generate: 0}, {notify: false})
        }        

        if(!$(event.target).hasClass('cartbtn') && !$(event.target).hasClass('generateForm1200') && !$(event.target).hasClass('prepareGrant')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.patent', {patentId: patent.patentID, form1200generate: null}, {notify: false})            
        }

    };

    function noSubFilter(obj) {
        // console.log(obj)
        for (var key in obj) {
            if (obj[key]) return false;
        }
        return true;
    }


    $scope.filterByPropertiesMatchingAND = function (data) {
        var matchesAND = true;
        for (var obj in outsideFilterStore) {
            if( outsideFilterStore.hasOwnProperty(obj) ) {
                if (noSubFilter(outsideFilterStore)) continue;
                if (!outsideFilterStore[obj][data.p3sServices[0][obj]]) {
                    matchesAND = false;
                    break;
                }
            }
        }
        return matchesAND;
    };    





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
                outsideFilterStore = $scope.filter;
                $scope.portfolioData = vm.portfolioData;
                $scope.filtered = vm.filtered;
                $scope.getItems = function (obj, array) {
            
                    return (array || []).map(function (w) {
                        return w.p3sServices[0][obj];
                    }).filter(function (w, idx, arr) {

                        if (typeof w === 'undefined') {
                            return false;
                        }             
                        return arr.indexOf(w) === idx;
                    });
                };

                $scope.testFunction = function(key, value) {
                    console.log(key, value)
                    console.log($scope.selectedFilters.indexOf(key))
                    if(value == true && $scope.selectedFilters.indexOf(key) === -1) {
                        $scope.selectedFilters.push(key);
                    } else {
                        console.log('key : ', key)
                          var index = $scope.selectedFilters.indexOf(key);
                        console.log('index: ', index)
                          $scope.selectedFilters.splice(index, 1)
                    }
                    console.log($scope.selectedFilters)
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

    $scope.promise.then(
        function(response){

            response.forEach(function(data){
                if(data.clientRef == '') {
                    data.clientRef = '[No Client Reference Provided]'
                }
            })

            vm.portfolioData = response;
            vm.portfolioLoaded = true;

            $scope.$broadcast('portfolioLoaded', function(){})

        }
    )
}