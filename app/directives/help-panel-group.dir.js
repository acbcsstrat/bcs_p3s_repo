angular.module('ppApp').directive('helpPanelGroup', helpPanelGroup);

helpPanelGroup.$inject = ['$rootScope'];

function helpPanelGroup($rootScope) {

	return {
		restrict: 'AE',
		templateUrl: 'app/templates/directives/help-panel-group.tpl.htm',
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

angular.module('ppApp').directive('helpInformation', helpInformation);

helpInformation.$inject = ['$rootScope', '$compile'];

function helpInformation($rootScope, $compile) {

	return {
		restrict: 'AE',
		transclude: true, //transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.
	    scope: {
	      heading: '@' //use &attr in the scope option when you want your directive to expose an API for binding to behaviors
	    },
		link: function(scope, elem, attr) { //helpInformation access

			$rootScope.$on('itemSeleted', function(event, data, cat) {
			  	compileTemplate(data, cat);
			  	angular.element(document).find('#helpPanelId').css("margin-left", "-100%")
		  	})

			function generateTemplate(data) {


			}

			var setIndex, setTitle;

			function compileTemplate(data, cat) {

				if((setIndex === undefined && setTitle === undefined) || (setTitle !== data.title)) {
					setIndex = data.index; 
					setTitle = data.title;

					elem.empty();

					var template = '';

					template += '<h3 class="font-h3 font-weight-bold m-b-md">' + cat + ' | ' + data.title + '</h3>';

					for(var i = 0; i < data.info.length; i++) { //loop through the info items and create a template
						template += '<div class="m-b-sm">\
						<h4 class="font-h4 lh-default font-weight-bold">' + data.info[i].title + '</h4>\
						<p class="font-body font-body--content">' + data.info[i].content + '</p>\
						</div>'
					}

					var el = $compile(template)(scope);//Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope
					elem.append(el)
					return;
				}


			}

		}
	}
}