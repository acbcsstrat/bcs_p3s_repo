angular.module('ppApp').directive('avatarImg', avatarImg)

avatarImg.$inject = ['$rootScope', '$http'];


function avatarImg($rootScope, $http) {
	return {
		restrict: 'AE',
		templateUrl: 'app/templates/directives/avatar.tpl.htm',
		link: function(scope, elem, attr) {

			$http.get('../p3sweb/avatarImage')
			.then(
				function(response){
					if(response.data == '' || response.data == undefined) {
						scope.avatarImg = null;
					}
					else {
						scope.avatarImg = '../p3sweb/avatarImage';
					}
				}
			)

		}
	}
}