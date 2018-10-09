angular.module('ppApp').component('mainnav', {
	templateUrl: 'app/templates/nav/nav.main-nav.tpl.htm',
	controller: ['userService', 'mainNavService', function(userService, mainNavService){

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
		vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      vm.autoFocusContent = false;
      vm.menu = mainNavService;
      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };
      function isOpen(section) {
        return vm.menu.isSectionSelected(section);
      }
      function toggleOpen(section) {
      	 
        vm.menu.toggleSelectSection(section);
      }

	}]
	
})