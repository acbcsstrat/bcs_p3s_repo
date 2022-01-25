import FetchHelpService from '../services/app.helpInfo.serv.js';

openHelpPanel.$inject = ['$rootScope', '$timeout', '$cookies'];

function openHelpPanel($rootScope, $timeout, $cookies) { //1st opens panel

	return {
		restrict: 'E',
		template: require('html-loader!./html/open-help-button.tpl.htm').default,
		link: function(scope, elem, attr) {

            scope.displayFirstHelp = displayFirstHelp;

            function displayFirstHelp(value) {
                scope.displayHelp = value;
            }

            $timeout(function(){
                var dashboardLoaded = $cookies.get('dashboardLoaded');
                if(scope.firstTime && dashboardLoaded == undefined) {
                    scope.displayHelp = true;
                }  else {
                    scope.displayHelp = false;
                    scope.tooltip1 = true;
                }
            }, 5000);     
			elem.bind('click', function(what, you){	
				scope.$broadcast('helpRequired', true)
			})
			
		}
	}

}


helpPanel.$inject = ['$rootScope', 'FetchHelpService'];

function helpPanel($rootScope, FetchHelpService) { //2nd

    return {
        restrict: 'AE',
        transclude: true,
        template: require('html-loader!./html/help-panel.tpl.htm').default,
        link: function(scope, elem, attr) {
           
            var panel = elem[0].querySelector('.help-panel-default');

            function displayPanel(open) {
                if(open) {
                    angular.element(elem[0]).addClass('active');
                    return
                }
                angular.element(elem[0]).removeClass('active');

            }

            scope.$on('helpRequired', function(event, value ) {
                displayPanel(value);
            })

            scope.closeHelpPanel = function() {
                displayPanel(false);
            }

            scope.helpList = FetchHelpService.getAllInformation();

            scope.backOut = function() {
                $rootScope.$broadcast('backOut');
                angular.element(panel).removeClass('hide-help-panel') 
            }

            scope.helpItemSelected = function(category, item) {
                var helpInfo = FetchHelpService.getSelectedInformation(category, item);
                $rootScope.$broadcast('itemSeleted', helpInfo, category); 
                var panel = elem[0].querySelector('.help-panel-default');
                angular.element(panel).addClass('hide-help-panel')              
            }

        },
    }

}

helpPanelGroup.$inject = ['$rootScope']

function helpPanelGroup($rootScope) {

    return {
        restrict: 'AE',
        template: require('html-loader!./html/help-panel-group.tpl.htm').default,
        transclude: true, //transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.
        scope: {
          heading: '@' //use &attr in the scope option when you want your directive to expose an API for binding to behaviors
        }
    }

}

helpInformation.$inject = ['$rootScope', '$compile']

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
                angular.element(document).find('.help-panel-default').css("margin-left", "-50%")
            })

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

export default angular.module('directives.help-panel', [FetchHelpService])
	.directive('openHelpPanel', openHelpPanel)
	.directive('helpPanelGroup', helpPanelGroup)
	.directive('helpPanel', helpPanel)
    .directive('helpInformation', helpInformation)    
	.name;