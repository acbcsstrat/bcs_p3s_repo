angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio'; 
    
    vm.statuses = {
      topLevelStatus: [
        {name: 'All Patents'}, 
        {name: 'Action Available'}, 
        {name: 'No Action Available'}
      ],
      serviceStatus: [
        {name: 'All Patents', checked: true }, 
        {name: 'Regional Renewals', checked: false }, 
        {name: 'Euro-PCT', checked: false }
      ],
      europctStatus: [
        {name: 'Ready for E-PCT', checked: false }, 
        {name: 'Form 1200 generating', checked: false }, 
        {name: 'Form 1200 saved', checked: false }, 
        {name: 'In Progress', checked: false }
      ],
      renewalStatus: [
        {name: 'No Renewal Needed', checked: false }, 
        {name: 'Not Open for Renewal', checked: false }, 
        {name: 'Renewal In Place', checked: false }, 
        {name: 'Open for Renewal', checked: false }, 
        {name: 'Payment in Progress', checked: false }, 
        {name: 'Lapsed', checked: false }
      ],
      actionStatus: [
        {name: 'Epct available'},
        {name: 'Epct saved'}, 
        {name: 'Form 1200 saved'}, 
        {name: 'Epct rejected'}, 
        {name: 'Show price'}, 
        {name: 'Open for Renewal'}, 
        {name: 'Form 1200 generating'}
      ]
    }

    vm.rowSelect = rowSelect;
    vm.portfolioData = patents;
    vm.updateCategory = updateCategory;
    vm.panelActive = true;
    vm.selectedItem = vm.statuses.serviceStatus[0].name;

    vm.filterSecondLevelCat = [
      {
        title: 'Services',
        statuses: (function() {
          return chunkDataService.chunkData(arrayOfNames(vm.statuses.serviceStatus), 4);    
        }())
      },
      {
        title: 'Euro-PCT',
        statuses: (function() {     
          return chunkDataService.chunkData(arrayOfNames(vm.statuses.europctStatus), 4);    
        }())
      },
      {
        title: 'Renewal',
        statuses: (function() {
            
          return chunkDataService.chunkData(arrayOfNames(vm.statuses.renewalStatus), 4);    
        }())
      }
    ]

    function arrayOfNames(array) {
      var arr = [];
      array.forEach(function(item){
        arr.push(item)
      })
      return arr;
    }  

    console.log(vm.filterSecondLevelCat)
    
    function checkAction(item) {
      var found = false;
      vm.statuses.actionStatus.forEach(function(i){
        if(i.name == item) {
          found = true;
        }
      })
      return found;
    }

    function updateData(obj) {

      var data = [];

      if(obj == 'Action Available') {
        for(var i = 0; i < patents.length; i++) {
          for(var j = 0; j < patents[i].serviceList.length; j++) {
            console.log(checkAction(patents[i].serviceList[j].serviceStatus))
            if(checkAction(patents[i].serviceList[j].serviceStatus)) {
              data.push(patents[i])
            }
          }
        }
      }

      return data;

    }

    function updateCategory(obj, position) {
      vm.portfolioData = patents;
      if(typeof position === 'undefined') {
        if(obj.name == 'All Patents') {
          vm.portfolioData = patents;
        } else {
          vm.portfolioData = updateData(obj.name);
        }
      }

        // if(vm.statuses.serviceStatus.includes(obj.name)) {
        //   // console.log(item, model, index)
        //   vm.filterSecondLevelCat[0].statuses[0].forEach(function(subscription, i) {
        //     if(index !== i) {
        //       // $scope.teststatus.checked = false;
        //     }
        //     // if()
        //   })
        //   // checked. = false;
        // }
      

    }

    $timeout(function(){
      vm.animate = true;
    }, 300);    

    angular.element(function(){
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
