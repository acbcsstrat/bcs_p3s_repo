angular.module('ppApp').directive('selectAvatar', selectAvatar);

selectAvatar.$inject = ['$timeout'];

function selectAvatar($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            function dataURItoBlob(dataURI) { //In computer science Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format 
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg '});
            }

            element.bind('change', function(event) { //2/3

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
