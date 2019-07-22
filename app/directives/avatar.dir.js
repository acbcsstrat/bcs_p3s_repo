angular.module('ppApp').directive('avatarImg', avatarImg)

avatarImg.$inject = ['$rootScope','$stateParams', '$interval', '$cookies', '$uibModal'];


function avatarImg($rootScope, $stateParams, $interval, $cookies, $uibModal) {
	return {
		restrict: 'AE',
		templateUrl: 'app/templates/directives/avatar.tpl.htm',
		link: function(scope, elem, attr) {
			scope.avatarImg = '../p3sweb/avatarImage';
			$rootScope.$on('updateImage', function(){
				scope.avatarImg = '../p3sweb/avatarImage';
			})
		}
	}
}