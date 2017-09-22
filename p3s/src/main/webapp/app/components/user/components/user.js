app.component('user', {
  	bindings: { 
        user: '<',
        timezones: '<'
    },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', 'timezoneService', '$q', function(userService, timezoneService, $q) {
		
		var vm = this;

        vm.message = "hello";

        vm.updateUser = function(user) {
        	userService.updateUser(user);
        }

        vm.listUsers = function() {

            userService.listUsers()
            .then(
                function(response){
                    vm.listCompUsers = response;  
                },
                function(errResponse){
                    console.log(errResponse)
                })
        }



        vm.listUsers();
	  	
	}]
});