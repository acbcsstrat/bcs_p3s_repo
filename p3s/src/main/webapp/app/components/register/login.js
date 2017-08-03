angular.module('myApp').component('login', {
	templateUrl: 'app/components/register/views/login.htm',
	controller: function(authentication) {
		
		var vm = this;

		vm.login = function() {
			authentication.login(vm.user);
		}
	}
});