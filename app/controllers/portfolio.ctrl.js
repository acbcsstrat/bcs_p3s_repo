angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter', 'organiseTextService', 'organiseColourService'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter, organiseTextService, organiseColourService) {

    var vm = this;
    vm.pageTitle = 'Portfolio';
    $scope.portfolioData = patents;
    vm.stateParams = $stateParams.patentId; 
    vm.rowSelect = rowSelect;
    vm.date = new Date();   
    vm.updateCategory = updateCategory;
    vm.panelActive = true; 
    vm.toggleAll = toggleAll;
    vm.sortType = sortType;
    vm.sortReverse  = false;
    vm.selectedSortType = 'ep_ApplicationNumber';
    vm.select = select;
    vm.selected = 0;
    vm.filterPortfolioResults = filterPortfolioResults;


    var portfolioTimeout = $timeout(function(){
        vm.portfolioLoaded = true;
    }, 300);

    var euroPctStatuses = ['Epct available', 'Epct saved', 'Epct not available', 'Epct being generated', 'Payment in progress', 'EPO instructed', 'Too early', 'Too late', 'Error', 'Completed','Payment failed'];
    var renewalStatuses = ['Show price', 'Renewal in place', 'No renewal needed', 'Payment in progress', 'EPO instructed', 'Too late to renew', 'Way too late to renew'];
    var grantStatuses = ['Grant available', 'Grant not available', 'Grant saved', 'Manual processing', 'Manual processing mandated', 'Payment in progress', 'EPO instructed', 'Payment failed', 'Completed'];

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

    function updateCategory(status) {

        for(var filter in $scope.filters) {
            if($scope.filters.hasOwnProperty(filter)) {
                for(var i in $scope.filters[filter]) {
                  $scope.filters.serviceStatus[i] = false;
                  $scope.filters.currentStageColour[i] = false;
                }
            }
        };

        if(status === 'All Patents') {
            $scope.portfolioData = patents;
        }

        if(status === 'Action Available') {
            $scope.portfolioData = patents.filter(function(el){
                if(el.p3sServices && el.p3sServices.length > 0) {
                    return organiseTextService.actionStatus(el.p3sServices[0].serviceStatus)
                }
            })
        }

        if(status === 'No Action Available') {
            $scope.portfolioData = patents.filter(function(el){
                if(el.p3sServices.length === 0) {
                    return el;
                }
                if(el.p3sServices && el.p3sServices.length > 0) {
                    return !organiseTextService.actionStatus(el.p3sServices[0].serviceStatus)
                }
            })
        }      

    }

    function filterPortfolioResults(filter) {

      $scope.portfolioData = patents;
      $scope.portfolioData = $scope.portfolioData.filter(function(el){

        for(var filter in $scope.filters){
            var filterArray = [];
            for(var i in $scope.filters[filter]){
                if($scope.filters[filter][i]) filterArray.push(i.toLowerCase()); //if property in filter object returns true, push to filterArray
            }
            if(el.p3sServices && el.p3sServices.length > 0) {
                for(var i = 0; i < el.p3sServices.length; i++) {            
                    var notUiText = organiseTextService.uiStatus(el.p3sServices[i][filter])
                    if(notUiText !== undefined || typeof notUiText !== 'undefined') {
                      
                        if(filterArray.length > 0 && filterArray.indexOf(notUiText.toLowerCase()) === -1) { //not part of filter options
                          return false;
                        }
                    } else {
                        if(filterArray.length > 0 && filterArray.indexOf(el.p3sServices[i][filter].toLowerCase()) === -1) { //not part of filter options if servicetype or colour
                            return false;
                        }
                    }
                }

            } else { //to handle items that dont have a service 

                if(el.serviceStatus.toLowerCase() === 'epct not available') {
                    if(filterArray.length > 0 && filterArray.indexOf('manual processing only') === -1) {
                        return false
                    }
                } else {
                      if(filterArray.length > 0 && filterArray.indexOf(el.serviceStatus.toLowerCase()) === -1) {
                          return false;
                      }
                }
            }
        }

        return true;
      })

    }

    $scope.epctStages = (function() {
      
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){
                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(patent.p3sServices[j].serviceType == 'epct') {
                        result.push(patent.p3sServices[j]['currentStageColour'])
                    }
                }
            }
        }
        return uniqueArray(result); //check no duplicates
    }())

    $scope.renewalStages = (function() {
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){
                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(patent.p3sServices[j].serviceType == 'renewal') {
                        result.push(patent.p3sServices[j]['currentStageColour'])
                    }
                }
            }
        }
        return uniqueArray(result); //check no duplicates

    }())

    $scope.grantStages = (function() {
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){
                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(patent.p3sServices[j].serviceType == 'grant') {
                        result.push(patent.p3sServices[j]['currentStageColour'])
                    }
                }
            }
        }
        return uniqueArray(result); //check no duplicates

    }())



    $scope.europctStatus = (function(){
        
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){

                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(euroPctStatuses.indexOf(patent.p3sServices[j]['serviceStatus']) > -1) 
                        result.push(organiseTextService.uiStatus(patent.p3sServices[j]['serviceStatus'])) //organisetTextservice required as UI text and backend text are being mixed
                }
            } else { //if not p3sServices

                if(euroPctStatuses.indexOf(patent.serviceStatus) > -1) {
                    result.push(organiseTextService.uiStatus(patent.serviceStatus));
                }
            }
            
        }
        return uniqueArray(result); //check no duplicates
    }())

    $scope.renewalsStatus = (function(){
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){
                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(renewalStatuses.indexOf(patent.p3sServices[j]['serviceStatus']) > -1)
                        result.push(organiseTextService.uiStatus(patent.p3sServices[j]['serviceStatus']));
                    }
                } else {
                    if(renewalStatuses.indexOf(patent.serviceStatus) > -1) { //if not p3sServices
                        result.push(organiseTextService.uiStatus(patent.serviceStatus));
                    }
            }
        } 
      return uniqueArray(result); //check no duplicates
    }());

    $scope.grantStatus = (function(){
        var result = [];
        for(var i = 0; i < $scope.portfolioData.length; i++){
            var patent = $scope.portfolioData[i];
            if(patent.p3sServices && patent.p3sServices.length > 0){

                for(var j = 0; j < patent.p3sServices.length; j++){
                    if(grantStatuses.indexOf(patent.p3sServices[j]['serviceStatus']) > -1) {
                        result.push(patent.p3sServices[j].serviceStatusUI);
                    
                    }
                }
            } 
        }
        return uniqueArray(result); //check no duplicates
    }());    

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

    function sortType(column) {

        if(column == 'dueDate') {
            vm.selectedSortType = (function() {

                vm.sortDate = true;

                if(vm.sortReverse === false) {
                    $scope.portfolioData.sort(function(a, b){
                        var dateA = new Date(a.renewalDueDate), dateB = new Date(b.renewalDueDate);
                        return dateB - dateA;
                    });
                } else {
                    $scope.portfolioData.sort(function(a, b){
                        var dateA = new Date(a.renewalDueDate), dateB = new Date(b.renewalDueDate);
                        return dateB - dateA;
                    });
                }
          
            }());
        } else {
            vm.sortDate = false; //resets column if not selected
            vm.selectedSortType = column;
        }
    };

    $scope.$on('$destroy', function(){
        $timeout.cancel(portfolioTimeout);
    })


}