app.component('user', {
  	bindings: { 
        user: '<',
        timezones: '<'
    },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', 'timezoneService', function(userService, timezoneService) {
		
		var vm = this;

        vm.message = "hello";

        vm.updateUser = function(user) {
        	userService.updateUser(user);
        }
	  	
	}]
});