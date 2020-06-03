avatarImg.$inject = ['$http'];

function avatarImg($http) {
	return {
		restrict: 'AE',
		template: require('html-loader!./html/avatar.tpl.htm'),
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

function selectAvatar() {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            element.bind('change', function(event) { //2/3

                scope.uploadImg = false;
                scope.imgSelected = true;

                var input = this;

                if(input.files && input.files[0]) { //source: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.cropped.source = e.target.result; //2/3
                        });

                    }

                    reader.readAsDataURL(input.files[0]);

                }

            });
        }
    };

};


export default angular.module('directives.select-avatar', [])
    .directive('selectAvatar', selectAvatar)
    .directive('avatarImg', avatarImg)    
    .name;