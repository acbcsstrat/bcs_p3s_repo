angular.module('ppApp').directive('openHelpPanel', openHelpPanel);

openHelpPanel.$inject = [];

function openHelpPanel() {

	return {
		link: function(scope, elem, attr) {

			elem.bind('click', function(){

				scope.helpRequired = !scope.helpRequired;

			})

		}
	}

}