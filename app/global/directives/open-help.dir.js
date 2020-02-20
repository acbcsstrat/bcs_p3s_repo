angular.module('ppApp').directive('openHelpPanel', openHelpPanel);

openHelpPanel.$inject = ['$rootScope'];

function openHelpPanel($rootScope) {

	return {
		restrict: 'E',
		templateUrl: 'app/templates/directives/open-help-button.tpl.htm',
		link: function(scope, elem, attr) {

			elem.bind('click', function(){				
				scope.$broadcast('helpRequired', true)
			})
			
		}
	}

}