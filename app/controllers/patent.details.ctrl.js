angular.module('ppApp').controller('patentDetailsCtrl', patentDetailsCtrl);

patentDetailsCtrl.$inject = ['patent', 'ca', '$rootScope', '$scope', '$state', '$stateParams', 'renewalRestService', '$timeout']

function patentDetailsCtrl(patent, ca, $rootScope, $scope, $state, $stateParams, renewalRestService, $timeout) {

	var vm = this;

	vm.patent = patent;
    vm.testClick = testClick;

    function testClick (){
        $timeout(function(){  
            var evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 300)
    }


}

angular.module('ppApp').directive('template', ['$compile', '$http', function($compile, $http) {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, element, attrs) {

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