angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal) {

    var vm = this;

    $rootScope.page = 'Portfolio'; 

    vm.rowSelect = rowSelect;
    vm.displayPatents = displayPatents;
    vm.portfolioData = patents;

    // vm.$onInit = function() {

    //     vm.portfolioData = addItem(patents)
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

      // $scope.oneAtATime = true;

      // $scope.groups = [
      //   {
      //     title: 'Dynamic Group Header - 1',
      //     content: 'Dynamic Group Body - 1'
      //   },
      //   {
      //     title: 'Dynamic Group Header - 2',
      //     content: 'Dynamic Group Body - 2'
      //   }
      // ];

      // $scope.items = ['Item 1', 'Item 2', 'Item 3'];

      // $scope.addItem = function() {
      //   var newItemNo = $scope.items.length + 1;
      //   $scope.items.push('Item ' + newItemNo);
      // };

      // $scope.status = {
      //   isCustomHeaderOpen: false,
      //   isFirstOpen: true,
      //   isFirstDisabled: false
      // };

}