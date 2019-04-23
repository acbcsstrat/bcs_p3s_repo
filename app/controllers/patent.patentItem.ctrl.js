angular.module('ppApp').controller('patentItemCtrl', patentItemCtrl);

patentItemCtrl.$inject = ['patent', '$rootScope', '$scope', '$state', '$stateParams', 'renewalRestService']

function patentItemCtrl(patent, $rootScope, $scope, $state, $stateParams, renewalRestService) {

	var vm = this;

		vm.patent = patent;
		$scope.patent = patent;
		console.log(patent)

		vm.leftTabs = {
			'tab1': {
				template: 'app/templates/patent/patent.patent-info.tpl.htm',
				controller: 'patentInfoCtrl'
			},
			'tab2': {
	            template: 'app/templates/europct/europct.info.tpl.htm',
	            controller: 'euroPctInfoCtrl'
			}
		}

}

angular.module('ppApp').directive('template', ['$compile', '$http', function($compile, $http) {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, element, attrs) {
        	console.log('whatt')
            var template = attrs['template'];
            if(template!==undefined){
                // Load the template
                $http.get(template).then(function(html){
                    // Set the template
                    var e = angular.element(html.data);
                    var compiled = $compile(e);
                    element.html(e);
                    compiled($scope);
                });
            }
        }
    };
}]);

angular.module('ppApp').directive('dynController', ['$compile', '$parse',function($compile, $parse) {
  	return {
	    restrict: 'A',
	    terminal: true,
	    priority: 100000,
	    link: function(scope, elem, attrs) {
	            // Parse the scope variable
	            var name = $parse(elem.attr('dyn-controller'))(scope);

	            elem.removeAttr('dyn-controller');
	            elem.attr('ng-controller', name);

	            // Compile the element with the ng-controller attribute
	            $compile(elem)(scope)
  		}
	}
}]);