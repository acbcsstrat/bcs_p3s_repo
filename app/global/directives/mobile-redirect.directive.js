mobileRedirect.$inject = ['$window', '$interval'];

function mobileRedirect($window, $interval) {

	return {
		restrict: 'A',
		link: function(scope, elem, attr) {

			var smInterval, mdInterval;

			var rtime;
			var timeout = false;
			var delta = 200;

			function resizeend() {
			    if (new Date() - rtime < delta) {
			        setTimeout(resizeend, delta);
			    } else {
			        timeout = false;
					if($window.innerWidth < 769) {
						scope.smallDevice = true;
						mdInterval = $interval(function(){
							if(angular.element(document.querySelector("#mobileRedirectId")).hasClass('d-none')) {
								angular.element(document.querySelector("#mobileRedirectId")).removeClass('d-none');
							}
						}, 500)
					} 

					if($window.innerWidth >= 769) {
						scope.smallDevice = false;
					}
			    }               
			}

			angular.element(function(){
				if($window.innerWidth < 769) {
					scope.smallDevice = true;
					smInterval = $interval(function(){
						if(angular.element(document.querySelector("#mobileRedirectId")).hasClass('d-none')) {
								angular.element(document.querySelector("#mobileRedirectId")).removeClass('d-none');
						}
					}, 500)
				} 

				if($window.innerWidth >= 769) {
					scope.smallDevice = false
				} 					
			})

			angular.element($window).bind('resize', function(e){
			    rtime = new Date();
			    if (timeout === false) {
			        timeout = true;
			        setTimeout(function(){
			        	resizeend()
			        	scope.$apply()
			        }, delta);
			    }	

				// scope.$apply();// manuall $digest required as resize event is outside of angular
			})

		}
	}

}

export default angular.module('directives.mobile-redirect', [])
	.directive('mobileRedirect', mobileRedirect)
	.name;