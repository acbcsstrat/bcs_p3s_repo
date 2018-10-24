angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal', 'chunkDataService', 'filterFilter'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal, chunkDataService, filterFilter) {

    var vm = this;

    $rootScope.page = 'Portfolio';
    vm.portfolioData = patents;
    vm.rowSelect = rowSelect;
    // vm.selectCategory = selectCategory;
    vm.updateStatus = updateStatus;
    vm.updateCategory = updateCategory;
    vm.date = new Date();   
    // vm.selectFilters = selectFilters;
    vm.panelActive = true;
    var selectedItem = 'All Patents';     

    $timeout(function(){
      vm.animate = true;
    }, 300);    

    angular.element(function(){
      vm.patentsLoaded = true;
    });    
 
    vm.statuses = { //obj sent to function
      topLevelStatus: [
        {name: 'All Patents', checkName: 'All patents', checked: false }, 
        {name: 'Action Available', checkName: 'Action available', checked: false }, 
        {name: 'No Action Available', checkName: 'No action available', checked: false }
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

    // function noneChecked(array) {
    //   var contains;
    //   checkChecked().find(function(item){
    //     if(array.includes(item)) {
    //       contains = true;
    //     }
    //   })
    //   return contains;
    // }


    // function selectFilters(filterType) {
      
    //   vm.selectedOption = vm.statuses.topLevelStatus[0];
      
    //   if(filterType === 'selectAll') {
    //     checkedFilterArray.forEach(function(item) {
    //       item.checked = true;
    //     })
    //   } else {
    //     checkedFilterArray.forEach(function(item) {
    //       item.checked = false;
    //     })
    //   }

    //   updateData(patents)

    // }



    vm.selectedOption = vm.statuses.topLevelStatus[0]; 

    var checkedFilterArray = vm.statuses.serviceStatus.concat(vm.statuses.serviceStatus, vm.statuses.europctStatus, vm.statuses.renewalStatus);
    var actionStatusStrings = vm.statuses.actionStatus.map(item => item.name);
    var serviceStatusArray = vm.statuses.serviceStatus.map(item => item.checkName);
    var selectedCategory = 'All patents';
    var dataAvailable = patents;



    function compare(arr){
      const finalArray = [];
      arr.forEach((e1)=>checkChecked().forEach((e2)=> {if(e1 === e2){
           finalArray.push(e1)
          }
        }
      ));
      return finalArray;
    }

    function checkChecked() {
      return checkedFilterArray.filter(function(e){
        return e.checked;
      }).map(item => item.checkName);
    }

    function updateData(data) { //TO BE CONTINUED
      vm.portfolioData = data;
    }    

    function checkStatuses(dataAvailable) {
      var finalArray = [];
      dataAvailable.forEach(function(el){
        el.serviceList.find(function(i){
          if(checkChecked().includes(i.serviceStatus)) {
            finalArray.push(el)
          }
        })
      })
      updateData(finalArray)
    }


    function checkService(dataAvailable) {
      return dataAvailable.filter(function(el){
        return el.serviceList.find(function(i){
          return checkChecked().includes(i.serviceType) //return all items that have a serviceType value contained within the checked array
        })
      })
    }    

    function updateCategory(obj, filteredPatents) {
      
      selectedCategory = obj.checkName;

      if(selectedCategory == 'All patents') { //check category selected
        dataAvailable = patents; //categorisedPatents = patents
        checkedFilterArray.forEach(function(item) {
          item.checked = false;
        })
      } else {
        dataAvailable = patents.filter(function(el){
          return el.serviceList.find(item => {
            if(obj.name == 'Action Available') {
              return actionStatusStrings.includes(item.serviceStatus);
            } else {
              return !actionStatusStrings.includes(item.serviceStatus);
            }
          });
        })
      }

      if(checkChecked().length === 0) { //if no statuses are checked)
        updateData(dataAvailable);
      } else { //if a status is checked)
        
        dataAvailable.filter(function(el){
          return el.serviceList.find(function(item){
            return compare(serviceStatusArray).includes(item.serviceType); //check if
          })
        })

        if(checkService(dataAvailable).length === 0) { //if no service is selected i.e. regional renewal, euro-pct
          checkStatuses(dataAvailable)
        } else { //if service is selected
          checkStatuses(checkService(dataAvailable))
        }

      }
    }

    function updateStatus(obj, filteredPatents) {

    
          // if(serviceStatusArray.includes(obj.checkName) && noneChecked(statusesArray) === undefined) { //if  sevcie status and not checked
          //   console.log('if service status and no items checked')
          //   availablePatents = filteredPatents.filter(function(el){
          //     return el.serviceList.filter(function(item){
          //       return checkChecked().includes(item.serviceType)
          //     }).length
          //   })
          // }

    }



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