angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio'; 
    console.log(patents)
    vm.statuses = {
      topLevelStatus: [
        {name: 'All Patents'}, 
        {name: 'Action Available'}, 
        {name: 'No Action Available'}
      ],
      serviceStatus: [
        {name: 'Regional Renewals', checkName: 'Renewal', checked: false }, 
        {name: 'Euro-PCT', checkName: 'Form1200', checked: false }
      ],
      europctStatus: [
        {name: 'Ready for E-PCT', checkName: 'Epct available', checked: false }, 
        {name: 'E-PCT not available', checkName: 'Epct not available', checked: false }, 
        {name: 'Form 1200 generating', checkName: 'Epct being generated', checked: false }, 
        {name: 'Form 1200 saved', checkName: 'Epct saved', checked: false }, 
        {name: 'In Progress', checkName: 'In progress', checked: false }
      ],
      renewalStatus: [
        {name: 'No Renewal Needed', checkName: 'No renewal needed', checked: false }, 
        {name: 'Renewal In Place', checkName: 'Renewal in place', checked: false }, 
        {name: 'Open for Renewal', checkName: 'Show price', checked: false }, 
        {name: 'Payment in Progress', checkName: 'Payment in progress', checked: false }, 
        {name: 'EPO Instructed', checkName: 'EPO Instructed', checked: false }, 
        {name: 'Renew Through Phone', checkName: 'Too late to renew', checked: false }, 
        {name: 'Lapsed', checkName: 'Way too late to renew', checked: false }
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
    vm.updateSelection = updateSelection;
    vm.panelActive = true;
    vm.selectedItem = vm.statuses.topLevelStatus[0].name;
    console.log(vm.selectedItem)

    vm.filterSecondLevelCat = [
      {
        title: 'Services',
        statuses: (function() {
          return chunkDataService.chunkData(vm.statuses.serviceStatus, 4);    
        }())
      },
      {
        title: 'Euro-PCT',
        statuses: (function() {     
          return chunkDataService.chunkData(vm.statuses.europctStatus, 4);    
        }())
      },
      {
        title: 'Renewal',
        statuses: (function() {
            
          return chunkDataService.chunkData(vm.statuses.renewalStatus, 4);    
        }())
      }
    ]

    // var categoryStatus = 'All Patents';

    
    var checkedFilterArray = vm.statuses.serviceStatus.concat(vm.statuses.serviceStatus, vm.statuses.europctStatus, vm.statuses.renewalStatus);
    

    function updateCategory(obj) {
      if(obj.name == 'All Patents') {
        // categoryStatus = 'All Patents';
        vm.portfolioData = patents;
        checkedFilterArray.forEach(function(item) {
          item.checked = false;
        })
      } else {

        var actionStatusStrings = vm.statuses.actionStatus.map(item => item.name);

        vm.portfolioData = patents.filter(function(el){
          return el.serviceList.find(item => {
            if(obj.name == 'Action Available') {
              return actionStatusStrings.includes(item.serviceStatus);
            } else {
              return !actionStatusStrings.includes(item.serviceStatus);
            }
          });
        })
      }
    }

    function checkChecked() {
      return checkedFilterArray.filter(function(e){
        return e.checked;
      }).map(item => item.checkName);
    }

    function updateSelection(obj, position) {
      console.log(obj)
      vm.selectedItem = null;
      var serviceStatusArray = vm.statuses.serviceStatus.map(item => item.name);
      var renewalStatusArray = vm.statuses.renewalStatus.map(item => item.checkName);
      var epctStatusArray = vm.statuses.europctStatus.map(item => item.checkName);
      if(obj.checked === true) { //CHECKED
        if(serviceStatusArray.includes(obj.name)) { //SERVICE TYPE
          vm.portfolioData = patents.filter(function(el){
            return el.serviceList.find(function(item){
              if(checkChecked().includes(item.serviceStatus)){
                console.log('what')
                return checkChecked().includes(item.serviceStatus)
              } else {
                console.log('hello')
                return item.serviceType == 'Form1200';
              }
            })
          })
          // vm.portfolioData = vm.portfolioData.filter(function(el){
          //   return el.serviceList.find(function(item){
          //     return checkChecked().includes(item.serviceStatus)
          //   })
          // })          
        } 

        else { //STATUSES 
          vm.portfolioData = patents.filter(function(el){
            return el.serviceList.find(function(item){
              return checkChecked().includes(item.serviceStatus)
            })
          })
        }
      } else { // UN-CHECKED
        console.log('shouldnt be hit')
        console.log(checkChecked())
        if(checkChecked().length === 0) {
          vm.portfolioData = patents;
        } else {
          vm.portfolioData = patents.filter(function(el){ 
            return el.serviceList.find(function(item){
              console.log(item)
              return checkChecked().includes(item.serviceStatus)
            })
          })
        }
      }

    }

    

    $timeout(function(){
      vm.animate = true;
    }, 300);    

    angular.element(function(){
      vm.patentsLoaded = true;
    });

    vm.date = new Date();    

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