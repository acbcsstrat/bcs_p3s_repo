angular.module('ppApp').controller('form1200IntroCtrl', form1200IntroCtrl);

form1200IntroCtrl.$inject = ['$scope', 'patent', '$http', '$state'];

function form1200IntroCtrl($scope, patent, $http, $state) {

    var vm = this;

    vm.patent = patent;
    vm.initiate1200 = initiate1200;
    vm.loadingQuestions = false;

    function initiate1200(appNo) {

        $state.go('portfolio.patent.euro-pct.form1200.questionnaire', {}, {reload: false});

    }

}