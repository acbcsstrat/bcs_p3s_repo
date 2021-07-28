GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'FileUploader', 'SupportService'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, FileUploader, SupportService) {

	var vm = this;
	vm.subCategoryRequired = false;
	vm.formData = {};
	vm.formData.uploadedDocs = [];
	vm.categories = ['Intellectual Property', 'WebApp Technical', 'Other'];
	vm.subcategory = [];
	vm.checkSubcategories = checkSubcategories;
	vm.submitForm = submitForm;

    var uploader = $scope.uploader = new FileUploader({
    	autoUpload: true
    });	

	// $scope.uploader.onBeforeUploadItem = onBeforeUploadItem;

	// function onBeforeUploadItem(item) {

	//   item.formData.push({your: 'data'});
	//   console.log('item : ', item);
	// }

	// const toBase64 = file => new Promise((resolve, reject) => {
	//     const reader = new FileReader();
	//     reader.readAsDataURL(file);
	//     reader.onload = () => resolve(reader.result);
	//     reader.onerror = error => reject(error);
	// });

	// async function Main() {
	//    const file = document.querySelector('#myfile').files[0];
	//    console.log(await toBase64(file));
	// }


    // uploader.onCompleteItem = function(fileItem, response, status, headers) {
    // 	console.log('fileItem :', fileItem)

    // 	// toBase64(fileItem._file)
    // 	// .then(function(data){
    // 		vm.formData.uploadedDocs.push(JSON.stringify(fileItem.file))
    	

    // 	// console.log(await toBase64(fileItem._file))
    // 	// vm.formData.uploadedDocs.push(await toBase64(fileItem._file));
    // 	// console.log('vm.formData', vm.formData)
    //  //    console.info('onCompleteItem', fileItem, response, status, headers);
	   // 		 // var r = new FileReader();
	   //    // r.onloadend = function(e){
	   //    //   $scope.data = e.target.result;
	   //    // }
	   //    // r.readAsDataURL(fileItem._file);     
	   //    // console.log(r.readAsDataURL(fileItem._file))
    // };    

        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };


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

	function submitForm(data) {

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('subject', data.subject);
		formData.append('category', data.category);
		if(data.subcategory) {
			formData.append('subcategory', data.subcategory);
		} else {
			formData.append('subcategory', null);
		}
		formData.append('numUploads', vm.formData.uploadedDocs.length);
		formData.append('message', data.message);

		// if(vm.formData.uploadedDocs.length > 0) {
			console.log('$scope.files :', $scope.files)
           for (var i in $scope.files) {
                formData.append("uploadedDocs", $scope.files[i]);
            }




		    // for (var i = 0, j = vm.formData.uploadedDocs.length; i < j; i++) {
		    //     formData.append('uploadedDocs', vm.formData.uploadedDocs[i]);
		    // }			
			// formData.append('uploadedDocs', vm.formData.uploadedDocs);
		// } else {
		// 	formData.append('uploadedDocs', null);
		// }

		for(var pair of formData.entries()) {
		   console.log(pair[0]+ ', '+ pair[1]);
		}		

		SupportService.requestSupport(formData, config)
		.then(
			function(response){
				console.log('controller response', response)
			},
			function(errResponse){
				console.log('controller errResponse', errResponse)

			}
		)
		

	}









	

}


