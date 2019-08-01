angular.module('ppApp').directive('openHelpPanel', openHelpPanel);

openHelpPanel.$inject = [];

function openHelpPanel() {

	return {
		restrict: 'E',
		templateUrl: 'app/templates/directives/open-help-button.tpl.htm',
		link: function(scope, elem, attr) {

			scope.helpRequired = false;

			elem.bind('click', function(){
				scope.helpRequired = !scope.helpRequired;
			})
			
		}
	}

}