angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio'; 

    vm.rowSelect = rowSelect;
    // vm.displayPatents = displayPatents;
    vm.portfolioData = patents;
    vm.updateCategory = updateCategory;
    console.log(vm.portfolioData)
    vm.filterTopLevelCat = [  
      {name: 'All Patents'},
      {name: 'Action Available'},
      {name: 'No Action Available'}
    ]    

    var serviceArr = ['All Patents', 'Regional Renewals', 'Euro-PCT'];
    var europctArr = ['Ready for E-PCT', 'Form 1200 generating', 'Form 1200 saved', 'In Progress'];
    var renewalArr = ['No Renewal Needed', 'Not Open for Renewal', 'Renewal In Place', 'Open for Renewal', 'Payment in Progress', 'Lapsed'];

    var actionStatus = ['Epct available', 'Epct saved', 'Form 1200 saved', 'In Progress', 'Epct rejected', 'Show price', 'Open for Renewal'];

    vm.filterSecondLevelCat = [
      {
        title: 'Services',
        statuses: (function() {
          return chunkDataService.chunkData(serviceArr, 4);    
        }())
      },
      {
        title: 'Euro-PCT',
        statuses: (function() {
          return chunkDataService.chunkData(europctArr, 4);    
        }())
      },
      {
        title: 'Renewal',
        statuses: (function() {
          return chunkDataService.chunkData(renewalArr, 4);    
        }())
      }
    ]

    $scope.panelActive = true;

    $scope.selectedItem = {}

    $scope.selectedItem = vm.filterTopLevelCat[0];

    function displayContent(modal) {

      var data = [];

      if(modal.name == 'Action Available') {
        vm.portfolioData.forEach(function(item){
          item.serviceList.filter(function(status){
            console.log(status)
            if(actionStatus.includes(status.serviceStatus)) {
              console.log(item)
              data.push(item)
            }
          })
        })
      }

      if(modal.name == 'No Action Available') {
        vm.portfolioData.forEach(function(item){
          item.serviceList.filter(function(status){
            if(!actionStatus.includes(status.serviceStatus)) {
              console.log(item)
              data.push(item)
            }
          })
        })
      }      
      // console.log(data)
      return data;

    }

    function updateCategory(model) {
      vm.portfolioData = patents;
      if(model.name == 'All Patents') {

        vm.portfolioData = patents;
      } else {

        vm.portfolioData = displayContent(model)
      }

       
    }


    // vm.$onInit = function() {

    // }
    
    // function addItem(patents) { //using for testing two services

    //     patents[3].serviceList[1] = patents[2].serviceList[0];

    //     return patents

    // }

    $timeout(function() {
      vm.animate = true;
    }, 300);    

    angular.element(function () {
        vm.patentsLoaded = true;
    });

    vm.date = new Date();    










































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

    function manualProcessingModal() {
        $timeout(function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'app/templates/modals/modal.submitted-manual-processing.tpl.htm',
                appendTo: undefined,
                scope: $scope,
                controller: ['$uibModalInstance', '$scope', '$timeout', function($uibModalInstance, $scope, $timeout){

                    $scope.dismissModal = function () {
                        $uibModalInstance.close();
                    };

                }]
            });
        }, 500)
    }

    if($stateParams.actionRequest == 'manualProcessing') {
        manualProcessingModal();
    }

}


// .filter('myfilter', function() {
//    return function( items, condition) {
//     console.log(items)
//     var filtered = [];

//     if(condition === undefined || condition === ''){
//       return items;
//     }

//     angular.forEach(items, function(item) {          
//        if(condition === item.condition ||  item.condition === ''){
//          filtered.push(item);
//        }
//     });

//     return filtered;
//   };
// });
