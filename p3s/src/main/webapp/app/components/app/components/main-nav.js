app.component('mainnav', {
	templateUrl: 'p3sweb/app/components/app/views/main-nav.htm',
	controller: ['userService', function(userService){

		var vm = this;

		userService.fetchUser()
		.then(
			function(response){
				vm.user = response;
			},
			function(errResponse){
				console.log(errResponse)
			}
		)
	}]
})