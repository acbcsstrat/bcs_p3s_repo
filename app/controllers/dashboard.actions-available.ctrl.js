angular.module('ppApp').controller('renewalsCarouselCtrl', renewalsCarouselCtrl);

renewalsCarouselCtrl.$inject = ['$scope', '$timeout', 'dashboardService']

function renewalsCarouselCtrl($scope, $timeout, dashboardService) {

	var vm = this;

	vm.phaseLoaded = true;

    vm.date = new Date();


}