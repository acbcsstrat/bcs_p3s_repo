
angular.module('ppApp').directive('questionContent', questionContent);

questionContent.$inject = ['$rootScope', '$compile', '$timeout'];

function questionContent($rootScope, $compile, $timeout) {

	return {
		restrict: 'EA',
		require: '^^questionPanel',
		scope: true,
		template: '<div data-ng-include="questionTemplate"></div> ',
		link: function(scope, elem, attr, ctrl) {

			scope.validModel = {};

			ctrl.createButtons();

			scope.question = scope.question;
			scope.requiredYes = true;
			scope.requiredNo = true;

		    if(scope.question.checkItems) {
		        Object.keys(scope.question.checkItems).forEach(function(item){
		          	ctrl.formData[item] = scope.question.checkItems[item];
		        })
		    }

			if(scope.$parent.$last === true) {
				$timeout(function() {
					ctrl.initalSelect(0);
				});
			}

			//CHECK WHETHER USER INPUT IS VALID
			scope.isOptionValid = function(value) {
				ctrl.isOptionValid(value, scope.question)
			}
    
      		scope.updateChecklist = function(checklist, property, value) {
        		ctrl.formData[checklist].map(function(item){
          			if(property == item.stateCode) {
            			item.isSelected = value;
          			}
         			return item;
    			})
      		}

      		scope.addToFormData = function(property, value) {
        		if(property === ''){ return; }
    			ctrl.formData[property] = value
      		}

			scope.questionTemplate = 'app/templates/directives/' + ctrl.service +'/' + scope.question.template + '.question.tpl.htm';

		}
	}

}

angular.module("ppApp").directive("ngUploadChange",function(){
    return{
        scope:{
            ngUploadChange:"&"
        },
        link:function(scope, element, attrs){
            element.on("change",function(event){
                scope.$apply(function(){	
                    scope.ngUploadChange({$event: event});
                })
            })
            scope.$on("$destroy",function(){
                element.off();
            });
        }
    }
});

angular.module("ppApp").directive("selectMultiNgFiles", function() {
  return {
    require: "ngModel",
    link: function postLink(scope,elem,attrs,ngModel) {
      elem.on("change", function(e) {
        var files = elem[0].files;
        console.log(files)
        ngModel.$setViewValue(files);
      })
    }
  }
});

angular.module("ppApp").directive("selectNgFiles", function() { //if files to be uploaded vary in future, add condition to check type or create new directive
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            var validFormats = ['pdf'];
            elem.bind('change', function () {
                validFile(false);
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
            ngModel.$render = function () {
                ngModel.$setViewValue(elem[0].files[0]);
            };
            function validFile(bool) {
                ngModel.$setValidity('pdfIncorrect', bool);
            }
            ngModel.$parsers.push(function(value) {
                var ext = value.name.substr(value.name.lastIndexOf('.')+1);
                if(ext=='') return;
                if(validFormats.indexOf(ext) == -1){
                    return value;
                }
                validFile(true);
                return value;
            });
        }
    }
});

angular.module('ppApp').directive('anchorDisable', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            elem.on('click', function(e) {
            if (attrs.disabled) {
               e.preventDefault(); // prevent link click
            }
      });
    }
  };
});