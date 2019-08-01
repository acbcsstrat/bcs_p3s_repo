angular.module('ppApp').directive('helpPanel', helpPanel);

helpPanel.$inject = ['$rootScope', 'fetchHelpService'];

function helpPanel($rootScope, fetchHelpService) {

	return {
		restrict: 'AE',
		transclude: true,
		templateUrl: 'app/templates/directives/help-panel.tpl.htm',
		link: function(scope, elem, attr) {

			function displayPanel(open) {
				if(open) {
					angular.element(elem[0]).addClass('active')
					return
				}
				angular.element(elem[0]).removeClass('active')

			}

			scope.$watch('helpRequired', function() {
				if(scope.helpRequired === true) {
					displayPanel(scope.helpRequired)
				}
			})

			scope.closeHelpPanel = function() {
				scope.helpRequired = !scope.helpRequired
				displayPanel(scope.helpRequired)
			}

			scope.helpList = fetchHelpService.getAllInformation()

			scope.backOut = function() {
				$rootScope.$broadcast('backOut')
			}

			scope.helpItemSelected = function(category, item) {
				var helpInfo = fetchHelpService.getSelectedInformation(category, item);
				$rootScope.$broadcast('itemSeleted', helpInfo)
				
			}

		},
	}

}