app.component('user', {
  	bindings: { 
        user: '<',
        timezones: '<'
    },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', 'timezoneService', '$q', '$rootScope', function(userService, timezoneService, $q, $rootScope) {
		
		var vm = this;

        $rootScope.page = 'Profile'

        vm.updateUser = function(user) {
        	userService.updateUser(user);
        }

        userService.listUsers()
        .then(
            function(response){
                
                vm.companyUsers = response;
                var userCol = (response.length / 2) + 1;
                var newArr = [];

                function chunk(arr, size) {
                    for (i=0; i < arr.length; i+=size) {
                        newArr.push(arr.slice(i, i+size));
                    }
                    return newArr;
                }           

                vm.chunkedData = chunk(vm.companyUsers, userCol);
            },
            function(errResponse){
                console.log(errResponse)
            }
        )
        
	}]
});