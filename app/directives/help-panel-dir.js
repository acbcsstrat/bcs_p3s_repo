angular.module('ppApp').directive('helpPanel', helpPanel);

helpPanel.$inject = [];

function helpPanel() {

	return {
		link: function(scope, elem, attr) {

			scope.helpRequired = false;

			scope.$watch('helpRequired', function() {
				console.log('whatttttt')
			})

		}
	}

}