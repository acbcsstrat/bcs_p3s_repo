angular.module('ppApp').controller('portfolioCtrl', portfolioCtrl);

portfolioCtrl.$inject = ['patents', '$scope', '$state', '$stateParams','$rootScope', 'patentsRestService', '$timeout', '$uibModal'];

function portfolioCtrl(patents, $scope, $state, $stateParams, $rootScope, patentsRestService, $timeout, $uibModal) {

    var vm = this;

    $rootScope.page = 'Portfolio'; 

    vm.rowSelect = rowSelect;
    vm.portfolioData = patents;

    vm.formData = {};

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
                templateUrl: 'app/templates/modal.submitted-manual-processing.tpl.htm',
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