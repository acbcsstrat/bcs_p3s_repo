helpPanelGroup.$inject = ['$rootScope']

function helpPanelGroup($rootScope) {

	return {
		restrict: 'AE',
		template: require('html-loader!.html/directives/help-panel-group.tpl.htm'),
		transclude: true, //transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.
	    scope: {
	      heading: '@' //use &attr in the scope option when you want your directive to expose an API for binding to behaviors
	    },
		link: function(scope, elem, attr) { //helpInformation access

			$rootScope.$on('itemSeleted', function(event, data) {
			  	angular.element(document).find('#helpPanelId').addClass('hide-help-panel') //selected in help-panel.dir.js
			});

			$rootScope.$on('backOut', function(event, data) {
			  	angular.element(document).find('#helpPanelId').removeClass('hide-help-panel')
			  	angular.element(document).find('#helpPanelId').css('margin-left', '0')
			});


		}
	}

}

export default angular.module('directives.help-panel-group')
	.directive('helpPanelGroup', helpPanelGroup)
	.name;