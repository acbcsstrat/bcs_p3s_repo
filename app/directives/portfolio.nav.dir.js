angular.module('ppApp').directive('patentnav', patentNav)

patentNav.$inject = ['$stateParams', '$interval', '$cookies']


function patentNav($stateParams, $interval, $cookies) {
	return {
		restrict: 'AE',
		scope: {
			patents: '='
		},
		template: function() {
			var navigation = $stateParams.navigation || 'default';
        	return '<div data-ng-include="\'app/templates/nav/nav.' + navigation + '.tpl.htm\'"></div>'
		},
		link: function(scope, elem, attr) {

	    	var show;

	    	if($cookies.getObject('cookieObj') === undefined) {

		    	var cookieObj , expireDate;

		    	cookieObj = {};

				expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 1);

		    	$cookies.putObject('cookieObj', cookieObj, {'expires': expireDate});

	    		cookie = $cookies.getObject('cookieObj');
	    		cookie.firstAddPatent = false;

	    		$cookies.putObject('cookieObj', cookie)

	    		if(scope.patents !== undefined || typeof scope.patents !== 'undefined') {    			
					if(scope.patents.length === 0) {
					    show = $interval(function() {
					    	scope.noPatents = true;
					    }, 1000);
					}

	    		}
	    	}

			elem.on('$destroy', function(){
				$interval.cancel(show);
			})	    	



		}
	}
}
