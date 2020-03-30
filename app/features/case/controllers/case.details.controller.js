angular.module('ppApp').controller('patentDetailsCtrl', patentDetailsCtrl);

patentDetailsCtrl.$inject = ['patent', 'ca', '$rootScope', '$scope', '$state', '$stateParams', 'renewalRestService', '$timeout', 'patentsRestService', '$uibModal']

function patentDetailsCtrl(patent, ca, $rootScope, $scope, $state, $stateParams, renewalRestService, $timeout, patentsRestService, $uibModal) {

	var vm = this;

	vm.patent = patent;
    vm.updatePatent = updatePatent;    

    function updatePatentSuccess() {

        $state.reload();

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-patent-success.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });
        
    }

    function updatePatentError() {

        var modalInstance = $uibModal.open({
            templateUrl: 'app/templates/modals/modal.update-patent-error.tpl.htm',
            appendTo: undefined,
            controllerAs: '$ctrl',
            controller: ['$uibModalInstance', '$timeout', function($uibModalInstance, $timeout){

                this.dismissModal = function() {
                    $uibModalInstance.close();
                };

            }]

        });

    }

    function updatePatent(patent) {

        patentsRestService.updatePatent(patent, patent.patentID)
        .then(
            function(response){
                updatePatentSuccess();
            },
            function(errResponse){
                updatePatentError();
            }
        )

    };


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