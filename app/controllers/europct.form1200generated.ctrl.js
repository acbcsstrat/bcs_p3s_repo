angular.module('ppApp').controller('form1200GeneratedCtrl', form1200GeneratedCtrl);

form1200GeneratedCtrl.$inject = ['$scope', 'patent', '$http', '$state', '$stateParams', 'euroPctService', '$timeout'];

function form1200GeneratedCtrl($scope, patent, $http, $state, $stateParams, euroPctService, $timeout) {

    var vm = this;

    vm.patent = patent;
    vm.portfolioDir = portfolioDir;
    vm.loadingQuestions = false;
    vm.form1200 = {};
    var fetchForm1200 = fetchForm1200;

    if(!vm.form1200.form1200PdfUrl) {
        fetchForm1200()
    }

    function fetchForm1200() {
        
        euroPctService.fetchForm1200()
        .then(
            function(response){
                if(response) {
                    $timeout(function(){
                        if(response.patents[0].patentApplicationNumber) {
                            vm.form1200.form1200PdfUrl = true;
                        } else {
                            $timeout(function(){
                                fetchForm1200();
                            }, 10000)
                        }
                    }, 5000)
                }
            },
            function(errResponse){
                console.log(errResponse)
            }
        )
    }

    function portfolioDir() {
        $state.go('portfolio', {}, {reload: true});
    }

}