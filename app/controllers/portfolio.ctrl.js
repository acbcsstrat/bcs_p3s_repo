angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio';
    $scope.portfolioData = patents;
    vm.rowSelect = rowSelect;

    vm.date = new Date();   

    vm.panelActive = true;
    var selectedItem = 'All Patents';     

    $timeout(function(){
      vm.animate = true;
    }, 300);

    var euroPctStatuses = [
      'Epct available',
      'Epct saved',
      'Epct not available'
    ]

    var renewalStatuses = [
      'Show price'
    ]

    $scope.filters = {
      serviceType: {},
      serviceStatus: {},
      currentStageColour: {}
    }

    function uniqueArray(array) {
      return array.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
    }

    // $scope.statusGroup = $scope.getFieldsValues('serviceStatus');
    // $scope.serviceGroup = function(field){
    //   var result = [];
    //   for(var i = 0; i < $scope.portfolioData.length; i++){
    //       var patent = $scope.portfolioData[i];
    //       if(patent.serviceList && patent.serviceList.length > 0){
    //         for(var j = 0; j < patent.serviceList.length; j++){
    //               result.push(patent.serviceList[j][field]);
    //           }
    //       }
    //   }
    //   return uniqueArray(result);  //check no duplicates
    // };
    console.log($scope.portfolioData)
    $scope.epctStages = function(field, service) {
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
        var patent = $scope.portfolioData[i];
        if(patent.serviceList && patent.serviceList.length > 0){
          for(var j = 0; j < patent.serviceList.length; j++){
            if(patent.serviceList[j].serviceType == 'Form1200') {
              result.push(patent.serviceList[j][field])
            }
          }
        }
      }
      return uniqueArray(result); //check no duplicates

    }

    $scope.renewalStages = function(field, service) {
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
        var patent = $scope.portfolioData[i];
        if(patent.serviceList && patent.serviceList.length > 0){
          for(var j = 0; j < patent.serviceList.length; j++){
            if(patent.serviceList[j].serviceType == 'Renewal') {
              result.push(patent.serviceList[j][field])
            }
          }
        }
      }
      return uniqueArray(result); //check no duplicates

    }    

    $scope.europctStatus = function(field){
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
        var patent = $scope.portfolioData[i];
          if(patent.serviceList && patent.serviceList.length > 0){
            for(var j = 0; j < patent.serviceList.length; j++){
              if(euroPctStatuses.indexOf(patent.serviceList[j][field]) > -1)
                result.push(patent.serviceList[j][field]);
              }
          }
      }
      return uniqueArray(result); //check no duplicates
    };

    $scope.renewalsStatus = function(field){
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
          var patent = $scope.portfolioData[i];
          if(patent.serviceList && patent.serviceList.length > 0){
            for(var j = 0; j < patent.serviceList.length; j++){
              if(renewalStatuses.indexOf(patent.serviceList[j][field]) > -1)
                  result.push(patent.serviceList[j][field]);
              }
          }
      }
      return uniqueArray(result); //check no duplicates
    };

    $scope.testFl = function(el){
      for(var filter in $scope.filters){
        var filterArray = [];
        for(var i in $scope.filters[filter]){
          if($scope.filters[filter][i]) filterArray.push(i); //if property in filter object returns true, push to filterArray
        }
        for(var i = 0; i < el.serviceList.length; i++) {
          if(filterArray.length > 0 && filterArray.indexOf(el.serviceList[i][filter]) === -1) return false;
        }
      }
      return true; 
    };   

    vm.toggleAll = function($event, includeAll) { //used for clear or select all
      console.log(includeAll)
      for(var filter in $scope.filters) {
        if($scope.filters.hasOwnProperty(filter)) {
          
          for(var i in $scope.filters[filter]) {
            $scope.filters.serviceStatus[i] = includeAll;
          }
        }
      };    
    };

    function displayPatents() { //resets view so only list patents displays
        $state.go('portfolio');
    };

    function rowSelect(event){
        vm.patentInfoContent = true;
        if(!$(event.target).hasClass('cartbtn')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.patent.patent-info', {patentId: patentId});
        }
    };    


}