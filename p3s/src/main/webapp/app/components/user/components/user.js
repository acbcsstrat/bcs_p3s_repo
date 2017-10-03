app.component('user', {
  	bindings: { 
        user: '<',
        timezones: '<'
    },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', 'timezoneService', '$q', '$rootScope', '$scope', '$timeout', function(userService, timezoneService, $q, $rootScope, $scope, $timeout) {
		
		var vm = this;

        $rootScope.page = 'Profile'

        $scope.newPassword = '';

        vm.$onInit = function() {
            $scope.user = vm.user;
        }

        vm.updateUser = function(user, p) {
            if (user.newPassword !== '') {
                user.newPassword = p;
                $timeout(function() {
                    console.log(user)
                    userService.updateUser(user);
                }, 100);
            }
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