angular.module('myApp').component('user', {
  	bindings: { user: '<' },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', function(userService) {
		
		var vm = this;

        //============ form data

        vm.updateUser = function(user) {
        	// console.log(event)
        	userService.updateUser(user);
        }

        vm.checkbox = {}
	  	
	}]
});