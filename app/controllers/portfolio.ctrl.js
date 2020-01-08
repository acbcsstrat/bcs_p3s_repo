angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl)

portfolioCtrl.$inject = ['$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter', 'organiseTextService', 'organiseColourService', '$mdPanel', 'searchPatentService'];

function portfolioCtrl($scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter, organiseTextService, organiseColourService, $mdPanel, searchPatentService) {

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
        return matchesAND;
    }; 

    function updatePortfolioData() {
        patentsRestService.fetchAllPatents()
        .then(function(response) {
            vm.portfolioData = response;
        })        

    }

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
            vm.showFilter = showFilter;
            vm.showAddPatent = showAddPatent;
            vm.filtered = [];
            vm.portfolioData = response;
            vm.portfolioLoaded = true;

            function showAddPatent($event) {

                var panelPosition = $mdPanel.newPanelPosition()
                    .relativeTo($event.target)
                    .addPanelPosition($mdPanel.xPosition.OFFSET_START, $mdPanel.yPosition.BELOW);

                var config = {
                    attachTo: angular.element(document.body),
                    controller: ['mdPanelRef', '$scope', function(mdPanelRef, $scope) {


                        $scope.findPatent = function(patentNo) {
                            $scope.loadingPatent = true;
                            searchPatentService.findPatent(patentNo)
                            .then(
                                function(response) {
                                    $scope.foundPatent = response.data;
                                    $scope.loadingPatent = false;
                                    $scope.error = false;
                                    var patentJson = angular.toJson(response)
                                },
                                function(errResponse) {
                                    console.error('Error finding patent. Error message : ', errResponse)
                                    $scope.queriedPatent = false;
                                    $scope.loadingPatent = false;
                                    $scope.error = true;
                                    // $state.go('search-patent', {}, {reload: false});
                                    if(errResponse.status == 412) { //already added patent
                                        $scope.searchError = 'It looks like we\'ve already added Patent Application '+patentNo+' in to the system.  You should be able to find it in the List Patents page using the search boxes.';
                                    } 
                                    if(errResponse.status == 409){ //incorrect check digit
                                        $scope.searchError = 'It looks like the provided check digit differs from the check digit found at the European Patent Register. Please make sure the check digit is correct and try again.';
                                    }
                                    if(errResponse.status == 400) { //incorrect syntax
                                        $scope.searchError = 'We\'ve not been able to find that patent in the European Patent Register. Please enter an application number such as EP18123456.2';
                                    }


                                }
                            )

                        }

                        $scope.openConfirmModal = function(patent) {

                            var modalInstance = $uibModal.open({
                                templateUrl: 'app/templates/modals/modal.confirm-found-patent.tpl.htm',
                                appendTo: undefined,
                                controllerAs: '$ctrl',
                                controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                                    this.addPatent = function () {
                                        vm.addingPatent = true;
                                        $uibModalInstance.close();
                                        patentsRestService.savePatent(patent)
                                        .then(
                                            function(response){

                                                updatePortfolioData();
                                                
                                                var match = response.find(function(item){
                                                    return item.ep_ApplicationNumber == patent.ep_ApplicationNumber;
                                                })

                                            },
                                            function(errResponse){
                                                console.error('Error while saving Patent');
                                            }
                                        )

                                    };

                                    this.dismissModal = function () {
                                        $uibModalInstance.close();
                                    };

                                    this.cancelAdd = function() {
                                        $uibModalInstance.close();                  
                                    }

                                }]
                            })
                        }

                        $scope.$on('$destroy', function(){
                            $timeout.cancel(toPatentTimeout)
                        })                        

                    }],
                    controllerAs: '$ctrl',
                    position: panelPosition,
                    // animation: panelAnimation,
                    hasBackdrop: true,
                    targetEvent: $event,
                    templateUrl: 'app/templates/portfolio/add-patent.tpl.htm',
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

            function showFilter($event) {

                var panelPosition = $mdPanel.newPanelPosition()
                    .relativeTo($event.target)
                    .addPanelPosition($mdPanel.xPosition.OFFSET_END, $mdPanel.yPosition.BELOW);

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

    //SEARCH ADD PATENT



}