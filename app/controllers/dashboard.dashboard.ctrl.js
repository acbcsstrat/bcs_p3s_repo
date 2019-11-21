angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope', '$state', '$timeout', 'dashboardService', 'patentsRestService', '$rootScope'];

function dashboardCtrl ($scope, $state, $timeout, dashboardService, patentsRestService, $rootScope) {

    var vm = this;

    vm.animate = false;
    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();


    var promise = patentsRestService.fetchAllPatents();

    promise.then(
        function(response){
            if($state.current.name === 'dashboard') {
                dashboardService.sortPatents(response);
                $scope.dashboardData = response;
                $state.go('dashboard.content', {patents: response}, {reload: false});
                vm.dashboardLoaded = true;
            }
        }
    )

    $scope.$on('updatePatent', function(e, o){
        $scope.$broadcast('updateCost');
    })    


}