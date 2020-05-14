avatarImg.$inject = ['$http'];

function avatarImg($http) {
	return {
		restrict: 'AE',
		template: require('html-loader!./html/directives/avatar.tpl.htm'),
		link: function(scope, elem, attr) {

			$http.get('../p3sweb/avatar-image/')
			.then(
				function(response){
					if(response.data == '' || response.data == undefined) {
						scope.avatarImg = null;
					}
					else {
						scope.avatarImg = '../p3sweb/avatar-image/';
					}
				}
			)

		}
	}
}
 
export default angular.module('directives.avatar-img', [])
    .directive('avatarImg', avatarImg)
    .name;
