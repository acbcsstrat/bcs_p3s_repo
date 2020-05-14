openHelpPanel.$inject = ['$rootScope'];

function openHelpPanel($rootScope) {

	return {
		restrict: 'E',
		template: require('html-loader!./html/open-help-button.tpl.htm'),
		link: function(scope, elem, attr) {
			elem.bind('click', function(){				
				scope.$broadcast('helpRequired', true)
			})
			
		}
	}

}

export default angular.module('directives.open-help-panel')
	.directive('openHelpPanel', openHelpPanel)
	.name;