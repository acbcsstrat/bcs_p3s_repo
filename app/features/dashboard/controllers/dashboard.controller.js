DashboardController.$inject = ['$state',  '$timeout', '$scope', 'DashboardService', 'PatentsRestService'];

export default function DashboardController($state, $timeout, $scope,  DashboardService, PatentsRestService) {

    var vm = this;

    $scope.formalityData = {}
    $scope.dashboardLoaded = false;
    $scope.graphsLoaded = false;
     console.log('init')
    $scope.promise = PatentsRestService.fetchAllPatents();
     console.log('next init')
    $scope.promise
    .then(function(response) {
        console.log('first response')
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){
            DashboardService.sortPatents(response);
            $scope.formalityData = DashboardService.getPatents;
            if($state.current.name === 'dashboard') {
                console.log('whattt')
                $state.go('dashboard.content', {patents: response}, {reload: false});
            }
        }
    )

}