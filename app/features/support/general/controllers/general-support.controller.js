GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'SupportService', '$uibModal'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, SupportService, $uibModal) {

	var vm = this;
	vm.subCategoryRequired = false;
	vm.formData = {};
	vm.formData.uploadedDocs = [];
	vm.files = [];
	vm.categories = ['Intellectual Property', 'WebApp Technical', 'Other'];
	vm.subcategory = [];
	vm.checkSubcategories = checkSubcategories;
	vm.submitForm = submitForm;

	function init() {
		
	}

	init();
	

   	function checkDuplicate(file) {
   		return vm.files.some(function(e){
   			return e.name == file.name;
   		})
	}

    $scope.getFileDetails = function (e) {

    	var timeout;

        $scope.$apply(function () {
            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
			   	if(checkDuplicate(e.files[i])) {
			        var modalInstance = $uibModal.open({
			            template: require('html-loader!../html/modals/modal.duplicate-file.tpl.htm'),
			            scope: $scope,
			            controllerAs:'$ctrl',
			            controller: ['$uibModalInstance', function($uibModalInstance) {

			                this.dismissModal = function () {
			                    $uibModalInstance.close();
			                };
			            }]
			        });
			   	} else {
		   			vm.files.push(e.files[i])
			   	}
            }
        });

        e.value = null; //required to reset file input so the same file can be uploaded either twice, or in case they remove it and want to re-upload it
    };


	function checkSubcategories(data) {

		if(data == 'Intellectual Property') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Euro-PCT (Form 1200)', 'Renewals / Annuities', 'Grant and Publishing Fees, 71(3)', 'EP Validation', 'Other IP']
		}

		if(data == 'WebApp Technical') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Account Management', 'Patent applications', 'Fees', 'Reminders', 'Transactions', 'Technical Issue']
		}

		if(data !== 'Intellectual Property' && data !== 'WebApp Technical') {
			vm.subCategoryRequired = false;
		}

	}

	function submitForm(data) {

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('subject', data.subject);
		formData.append('category', data.category);

		if(data.subcategory) {
			formData.append('subcategory', data.subcategory);
		} else {
			formData.append('subcategory', '');
		}

		formData.append('numUploads', vm.files.length);
		formData.append('message', data.message);

		for (var i in vm.files) {
            formData.append("uploadedDocs", vm.files[i]);
        }

        

		SupportService.requestSupport(formData, config)
		.then(
			function(response){

				vm.formData = {}; //resets field values
				vm.subCategoryRequired = false;
				vm.files = [];
				$scope.supportForm.$setPristine(); //rest forms properties

		        var modalInstance = $uibModal.open({
		            template: require('html-loader!../html/modals/modal.support-success.tpl.htm'),
		            scope: $scope,
		            controllerAs:'$ctrl',
		            controller: ['$uibModalInstance', function($uibModalInstance) {

		            	this.phoneNumber = $scope.ppDetails.partnerPhone;

		                this.dismissModal = function () {
		                    $uibModalInstance.close();
		                };
		            }]
		        });
			},
			function(errResponse){
				
				console.error('controller errResponse', errResponse)

		        var modalInstance = $uibModal.open({
		            template: require('html-loader!../html/modals/modal.support-error.tpl.htm'),
		            scope: $scope,
		            controllerAs:'$ctrl',
		            controller: ['$uibModalInstance', function($uibModalInstance) {

		            	this.phoneNumber = $scope.ppDetails.partnerPhone;

		                this.dismissModal = function () {
		                    $uibModalInstance.close();
		                };
		            }]
		        });				

			}
		)
		

	}

}