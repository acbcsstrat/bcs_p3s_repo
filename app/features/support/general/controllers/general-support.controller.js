GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'FileUploader'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, FileUploader) {

	var vm = this;
	vm.subCategoryRequired = false;
	vm.formData = {};
	vm.categories = ['Intellectual Property', 'WebApp Technical', 'Other'];
	vm.subcategory = [];
	vm.checkSubcategories = checkSubcategories;

    var uploader = $scope.uploader = new FileUploader({
    	autoUpload: true
    });	

	function checkSubcategories(data) {

		if(data == 'Intellectual Property') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Euro-PCT (Form 1200)', 'Renewals', 'Grant and Publishing Fees, 71(3)', 'EP Validation', 'Other IP']
		}

		if(data == 'WebApp Technical') {
			vm.subCategoryRequired = true;
			vm.subcategory = ['Account Management', 'Patent applications', 'Fees', 'Reminders', 'Transactions', 'Technical Issue']
		}

		if(data !== 'Intellectual Property' && data !== 'WebApp Technical') {
			vm.subCategoryRequired = false;
		}

	}

}


