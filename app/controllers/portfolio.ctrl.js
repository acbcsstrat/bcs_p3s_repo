angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter', 'organiseTextService', 'organiseColourService'];

function portfolioCtrl($scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter, organiseTextService, organiseColourService) {

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
    vm.toggleAll = toggleAll;
    vm.sortReverse  = false;
    vm.selectedSortType = 'ep_ApplicationNumber';

    var euroPctStatuses = ['Epct available', 'Epct saved', 'Epct not available', 'Epct being generated', 'Payment in progress', 'EPO Instructed', 'Too early', 'Too late', 'Error', 'Completed','Payment failed'];
    var renewalStatuses = ['Show price', 'Renewal in place', 'No renewal needed', 'Payment in progress', 'EPO Instructed', 'Too late to renew', 'Way too late to renew'];
    var grantStatuses = ['Grant available', 'Grant not available', 'Grant saved', 'Manual processing', 'Manual processing mandated', 'Payment in progress', 'EPO Instructed', 'Payment failed', 'Completed'];

    vm.patentActionStatuses = {
      'value': 'All Patents',
      'values': ['All Patents', 'No Action Available', 'Action Available']
    }

    $scope.filters = {
      serviceStatus: {},
      serviceType: {},
      currentStageColour: {}
    }


    function select(i) {
      vm.selected = i;
    }

    select($stateParams.patentId)

    function uniqueArray(array) {
        return array.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
    }



    function toggleAll($event, includeAll) { //used for clear or select all
        for(var filter in $scope.filters) {
            if($scope.filters.hasOwnProperty(filter)) {
                for(var i in $scope.filters[filter]) {
                    $scope.filters.serviceStatus[i] = includeAll;
                    $scope.filters.currentStageColour[i] = includeAll;            
                }
            }
        };    
    };

    function rowSelect(event, patent){

        vm.stateParams = $stateParams;
        if($(event.target).hasClass('generateForm1200')) {
          $state.go('portfolio.patent', {patentId: patent.patentID, form1200generate: 1, prepareGrant: 0}, {notify: false})
        }

        if($(event.target).hasClass('prepareGrant')) {
          $state.go('portfolio.patent', {patentId: patent.patentID, prepareGrant: 1, form1200generate: 0,}, {notify: false})
        }        

        if(!$(event.target).hasClass('cartbtn') && !$(event.target).hasClass('generateForm1200') && !$(event.target).hasClass('prepareGrant')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.patent', {patentId: patent.patentID, form1200generate: null}, {notify: false})            
        }

    };


    $scope.promise.then(
        function(response){
            var patents = response;
            $scope.portfolioData = patents;
            $scope.portfolioLoaded = true;
            $scope.$broadcast('portfolioLoaded', function(){})
            vm.sortType = sortType;
            vm.filterPortfolioResults = filterPortfolioResults;
            vm.updateCategory = updateCategory;

        }
    )

}