DashboardController.$inject = ['$state',  '$timeout', '$scope', 'DashboardService', 'CasesRestService', '$rootScope'];

export default function DashboardController($state, $timeout, $scope,  DashboardService, CasesRestService, $rootScope) {

    var vm = this;

    $scope.formalityData = {}
    $scope.dashboardLoaded = false;
    $scope.graphsLoaded = false;
    $scope.promise = CasesRestService.fetchAllCases();
    $scope.promise
    .then(function(response) {
        if ($scope.$$destroyed) throw "Scope destroyed";
        return response;
    })
    .then(
        function(response){
            console.log(response)
            if(response.length) {
                DashboardService.sortPatents(response);
                $scope.formalityData = DashboardService.getPatents;
            }            



            
            if($state.current.name === 'dashboard') {
                $state.go('dashboard.content', {patents: response}, {reload: false});          
            }
        }
    )

}