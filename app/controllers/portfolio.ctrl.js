angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio';
    // vm.portfolioData = patents;
    vm.rowSelect = rowSelect;

    vm.date = new Date();   

    vm.panelActive = true;
    var selectedItem = 'All Patents';     

    $timeout(function(){
      vm.animate = true;
    }, 300);

    angular.element(function(){
      vm.patentsLoaded = true;
    });
 
    // console.log(patents);

    // function fetchServiceData(serviceQuery) {
    //   return patents.filter(function(el){
    //     return el.serviceList.find(function(item){
    //       return item.serviceType == serviceQuery;
    //     })
    //   })
    // }

    // var europctArray = fetchServiceData('Form1200')
    // var renewalsArray = fetchServiceData('Renewal')

    var uniqueItems = function (data, key) {
        var result = [];
            
        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];
     
            if (result.indexOf(value) == -1) {
                result.push(value);
            }
        
        }
        return result;
    };    

    $scope.filters = {
      serviceType: {},
      serviceStatus: {}
    }

    $scope.portfolioData = patents;

    function uniqueArray(array) {
      return array.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
    }

    // $scope.statusGroup = $scope.getFieldsValues('serviceStatus');
    $scope.serviceGroup = function(field){
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
          var patent = $scope.portfolioData[i];
          if(patent.serviceList && patent.serviceList.length > 0){
            for(var j = 0; j < patent.serviceList.length; j++){
                  result.push(patent.serviceList[j][field]);
              }
          }
      }
      return uniqueArray(result);  //check no duplicates
    };

    $scope.statusGroup = function(field){
      var result = [];
      for(var i = 0; i < $scope.portfolioData.length; i++){
          var patent = $scope.portfolioData[i];
          if(patent.serviceList && patent.serviceList.length > 0){
            for(var j = 0; j < patent.serviceList.length; j++){
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
                if($scope.filters[filter][i]) filterArray.push(i);
            }
            for(var i = 0; i < el.serviceList.length; i++) {
                if(filterArray.length > 0 && filterArray.indexOf(el.serviceList[i][filter]) === -1) return false;
            }     
        }
        return true;
    };   

    // $scope.testFl2 = function(el){
    //     var filterArray = [];
    //     for(var i in $scope.filters.location){
    //         if($scope.filters.location[i]) filterArray.push(i);
    //     }
    //     return filterArray.length > 0 && filterArray.indexOf(el.location) === -1 ? false : true;
    // };

     // console.log(patent)

    this.toggleAll = function($event, includeAll) { //used for clear or select all
      filters.forEach(function(filterCategory) {      
        filterCategory.options.forEach(function(option) {
          option.IsIncluded = includeAll;
        });
      });    
    };

    // function displayPatents() { //resets view so only list patents displays
    //     $state.go('portfolio');
    // };

    function rowSelect(event){
        vm.patentInfoContent = true;
        if(!$(event.target).hasClass('cartbtn')) {
            var id = ($($(event.currentTarget).find('a'))); //find the anchor tag within row (patentApplicationNumber)
            var patentId = id[0].id; //gets data from data-id
            $state.go('portfolio.patent.patent-info', {patentId: patentId});
        }
    };    


}