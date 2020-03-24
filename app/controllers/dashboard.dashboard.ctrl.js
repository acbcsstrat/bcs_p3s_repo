angular.module('ppApp').controller('dashboardCtrl', dashboardCtrl);

dashboardCtrl.$inject = ['$scope', '$state', '$timeout', 'dashboardService', 'patentsRestService', '$rootScope'];

function dashboardCtrl ($scope, $state, $timeout, dashboardService, patentsRestService, $rootScope) {

    var vm = this;

    vm.pageTitle = 'Dashboard';
    vm.date = new Date().getTime();
    $scope.formalityData = {}
    $scope.dashboardLoaded = false;
    $scope.graphsLoaded = false;

    $scope.promise = patentsRestService.fetchAllPatents();
    $scope.promise
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){
            dashboardService.sortPatents(response);
            $scope.formalityData = dashboardService.getPatents;
            console.log('$scope.formalityData : ', $scope.formalityData)
            if($state.current.name === 'dashboard') {
                $state.go('dashboard.content', {patents: response}, {reload: false});
            }
        }
    )


}