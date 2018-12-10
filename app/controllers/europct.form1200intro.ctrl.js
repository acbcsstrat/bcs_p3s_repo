angular.module('ppApp').controller('form1200IntroCtrl', form1200IntroCtrl);

form1200IntroCtrl.$inject = ['$scope', 'patent', '$http', '$state', 'form1200Service'];

function form1200IntroCtrl($scope, patent, $http, $state, form1200Service) {

    var vm = this;

    vm.patent = patent;
    vm.initiate1200 = initiate1200;
    vm.loadingQuestions = false;

    function initiate1200(id) {

        form1200Service.fetchQuestions(id)
        .then(
            function(response){
                if(response !== null) {
                    $state.go('portfolio.patent.euro-pct.form1200.questionnaire', {questions: response}, {reload: false});
                }
            },
            function(errResponse){
                console.log('error: ', errResponse)
            }
        )

        
    }

}