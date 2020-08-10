ForgotPasswordController.$inject = ['$state', '$rootScope','$http', '$scope', '$cookies', 'AuthorisationService', '$uibModal']

export default function ForgotPasswordController($state, $rootScope, $http, $scope, $cookies, AuthorisationService, $uibModal) {

	var vm = this;

	vm.submitEmail = submitEmail;

	function submitEmail(emailAddress) {

		var params = {
			emailAddress: emailAddress
		}

		AuthorisationService.SubmitForgottenEmail(params)
		.then(
			function(response){
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.forgot-password-success.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })
                $state.go('login'); 
			},
			function(errResponse){
                vm.dataLoading = false;
                $state.go($state.current, {}, {reload: true});
                var modalInstance = $uibModal.open({
                    template: require('html-loader!../html/modals/modal.forgot-password-error.tpl.htm'),
                    appendTo: undefined,
                    controllerAs: '$ctrl',
                    controller: ['$uibModalInstance', '$location', '$anchorScroll', function($uibModalInstance, $location, $anchorScroll) {

                       
                        this.dismissModal = function () {
                            $uibModalInstance.close();
                        };


                    }]
                })   
			}
		)


	}


}