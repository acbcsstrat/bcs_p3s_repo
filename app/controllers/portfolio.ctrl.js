angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio';
    vm.portfolioData = patents;
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
 
    console.log(patents);

    function fetchServiceData(serviceQuery) {
      return patents.filter(function(el){
        return el.serviceList.find(function(item){
          return item.serviceType == serviceQuery;
        })
      })
    }

    var europctArray = fetchServiceData('Form1200')
    var renewalsArray = fetchServiceData('Renewal')

    $scope.data = patents;
    $scope.filter = {};
    $scope.categories = ['serviceType', 'europctStatus', 'renewalStatus'];
    var renewalStatusArr = [
      'No Renewal Needed', 
      'Renewal In Place', 
      'Open for Renewal', 
      'Payment in Progress', 
      'EPO Instructed', 
      'Renew Through Phone', 
      'Lapsed',
      'Show price'
    ]
    var europctStatusArr = [
        'Epct available', 
        'Epct not available', 
        'Epct available', 
        'Epct being generated',
        'Epct saved',
        'Payment in progress',
        'Completed'
      ]    
    // $scope.addProps = function(obj, array) {

    //   if (typeof array === 'undefined') {
    //     return false;
    //   }
    //   return array.reduce(function (prev, item) {
    //     if (typeof item[obj] === 'undefined') {
    //       return prev;
    //     }
    //     return prev + parseFloat(item[obj]);
    //   }, 0);
    // }

    $scope.getItems = function (obj, array) { //fired once at beginning
      return (array || []).map(function (w) {
        return w.serviceList.find(function(e){
          if(obj == 'europctStatus') {
            if(europctStatusArr.includes(e.serviceStatus)) {
              return e.serviceStatus;
            }
          }
          if(obj == 'renewalStatus') {
            if(renewalStatusArr.includes(e.serviceStatus)) {
              return e.serviceStatus;
            }
          }
          
          if(e[obj]) {
            return e[obj];
          }

        }); 
      }).map(function(e){ //fetches the nested items in seviceList
        if(typeof e !== 'undefined') {
          if(obj == 'europctStatus') {
            if(europctStatusArr.includes(e.serviceStatus)) {
              return e.serviceStatus;
            }
          }
          if(obj == 'renewalStatus') {
            if(renewalStatusArr.includes(e.serviceStatus)) {
              return e.serviceStatus;
            }
          }
          
          if(e[obj]) {
            // console.log(e[obj])
            return e[obj];
          }
        }
      }).filter(function (w, idx, arr) {
        
        if (typeof w === 'undefined') {
          return false;
        }
        
       return arr.indexOf(w) === idx;
        
      });
    };    

    $scope.filterByPropertiesMatchingAND = function (data, index) {

      var matchesAND = true;
      for (var obj in $scope.filter) {
        if( $scope.filter.hasOwnProperty(obj) ) { //prevent inherited properties from object model
          if (noSubFilter($scope.filter[obj])) continue;  //check if any items checked
          data.serviceList.forEach(function(el){
            
            if(el[obj]) { //condition to check if serviceType
              if (!$scope.filter[obj][el[obj]]) { //if item is not checked in fitler
                matchesAND = false;
                return false;
              }
            } else {
              if(!$scope.filter[obj][el.serviceStatus]) {
                matchesAND = false;
                return false;
              }
            }

          })
        }
      }

      return matchesAND;

    };

    
   

    function noSubFilter(obj) { //returns true for each filter item that is checked
      // console.log(obj)
      for (var key in obj) {
        if (obj[key]) return false; 
      }
      return true;
    }


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