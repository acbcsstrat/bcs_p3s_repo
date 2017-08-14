angular.module('myApp').component('register', {
	templateUrl: 'app/components/register/views/register.htm',
	controller: function(authentication) {

		var vm = this;

		vm.register = function() {
			authentication.register(vm.user);
			
		} //register
		
	}
});