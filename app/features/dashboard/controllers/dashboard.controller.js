DashboardController.$inject = ['$state',  '$timeout', '$scope','$rootScope', '$cookies', '$uibModal', 'DashboardService', 'CasesRestService'];

export default function DashboardController($state, $timeout, $scope, $rootScope, $cookies, $uibModal, DashboardService, CasesRestService) {

    var vm = this;

    $scope.formalityData = {}
    $scope.dashboardLoaded = false;
    $scope.graphsLoaded = false;
    $scope.promise = CasesRestService.fetchAllCases();
    $scope.promise
    .then(function(response) {
        console.log('response', response)
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){
            console.log('follow up')
            if($scope.firstTime) {
                welcomeMessageModal()
            }

            if(response.length) {
                DashboardService.sortPatents(response);
                $scope.formalityData = DashboardService.getPatents;
            }            
            console.log('$state.current.name : ', $state.current.name)
            if($state.current.name === 'dashboard') {
                $state.go('dashboard.content', {patents: response}, {reload: false});
                $scope.dashboardLoaded = true;
            }
        }
    )

    function welcomeMessageModal() {

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.welcome-message.tpl.htm'),
            scope: $scope,
            controllerAs:'$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance) {
                        console.log('what')
                this.dismissModal = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    }

}