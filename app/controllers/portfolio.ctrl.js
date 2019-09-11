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

    $timeout(function(){
      vm.portfolioLoaded = true;
    }, 300);

    var euroPctStatuses = ['Epct available', 'Epct saved', 'Epct not available', 'Epct being generated', 'Payment in progress', 'EPO instructed', 'Too early', 'Too late'];
    var renewalStatuses = ['Show price', 'Renewal in place', 'No renewal needed', 'Payment in progress', 'EPO instructed', 'Too late to renew', 'Way too late to renew'];
    vm.patentActionStatuses = {
      'value': 'All Patents',
      'values': ['All Patents', 'No Action Available', 'Action Available']
    }

    $scope.filters = {
      serviceStatus: {},
      serviceType: {},
      currentStageColour: {}
    }

    function init() {
        patents.map(function(service, i){
            service.P3Sservice = service.serviceList;
            delete service.serviceList;
            return service.P3Sservice.map(function(list){
                list.actionable = organiseTextService.actionStatus(list.serviceStatus) ? true : false;
                list.uiStatus = organiseTextService.uiStatus(list.serviceStatus);
                list.urgentAttention = list.currentStageColour === 'Red' ? true : false;
                if(list.currentStageColour) {
                    list.cssCurrent = organiseColourService.getCurrColour(list.currentStageColour, 'text')
                }
                if(list.nextStageColour) {
                    list.cssNext = organiseColourService.getCurrColour(list.nextStageColour, 'text')
                }
            })
            // if(item.serviceList.length > 0) {
            // }
        }) 

        console.log(patents)
    }

    init()


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
                if(el.serviceList && el.serviceList.length > 0) {
                    return organiseTextService.actionStatus(el.serviceList[0].serviceStatus)
                }
            })
        }

        if(status === 'No Action Available') {
            $scope.portfolioData = patents.filter(function(el){
                if(el.serviceList.length === 0) {
                    return el;
                }
                if(el.serviceList && el.serviceList.length > 0) {
                    return !organiseTextService.actionStatus(el.serviceList[0].serviceStatus)
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
            if(el.serviceList && el.serviceList.length > 0) {
                for(var i = 0; i < el.serviceList.length; i++) {            
                    var notUiText = organiseTextService.uiStatus(el.serviceList[i][filter])
                    if(notUiText !== undefined || typeof notUiText !== 'undefined') {
                      
                        if(filterArray.length > 0 && filterArray.indexOf(notUiText.toLowerCase()) === -1) { //not part of filter options
                          return false;
                        }
                    } else {
                        if(filterArray.length > 0 && filterArray.indexOf(el.serviceList[i][filter].toLowerCase()) === -1) { //not part of filter options if servicetype or colour
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
            if(patent.serviceList && patent.serviceList.length > 0){
                for(var j = 0; j < patent.serviceList.length; j++){
                    if(patent.serviceList[j].serviceType == 'Form1200') {
                        result.push(patent.serviceList[j]['currentStageColour'])
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
            if(patent.serviceList && patent.serviceList.length > 0){
                for(var j = 0; j < patent.serviceList.length; j++){
                    if(patent.serviceList[j].serviceType == 'Renewal') {
                        result.push(patent.serviceList[j]['currentStageColour'])
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
            if(patent.serviceList && patent.serviceList.length > 0){

                for(var j = 0; j < patent.serviceList.length; j++){
                    if(euroPctStatuses.indexOf(patent.serviceList[j]['serviceStatus']) > -1) 
                        result.push(organiseTextService.uiStatus(patent.serviceList[j]['serviceStatus'])) //organisetTextservice required as UI text and backend text are being mixed
                }
            } else { //if not servicelist

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
          if(patent.serviceList && patent.serviceList.length > 0){
            for(var j = 0; j < patent.serviceList.length; j++){
              if(renewalStatuses.indexOf(patent.serviceList[j]['serviceStatus']) > -1)
                  result.push(organiseTextService.uiStatus(patent.serviceList[j]['serviceStatus']));
              }
          } else {
            if(renewalStatuses.indexOf(patent.serviceStatus) > -1) { //if not servicelist
              result.push(organiseTextService.uiStatus(patent.serviceStatus));
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
          $state.go('portfolio.patent', {patentId: patent.id, form1200generate: 1}, {notify: false})
        }

        if(!$(event.target).hasClass('cartbtn') && !$(event.target).hasClass('generateForm1200')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.patent', {patentId: patent.id, form1200generate: null}, {notify: false})            
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


}