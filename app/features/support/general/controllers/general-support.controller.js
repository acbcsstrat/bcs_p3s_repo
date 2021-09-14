GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'SupportService', '$uibModal'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, SupportService, $uibModal) {

	var vm = this;
	vm.subCategoryRequired = false;
	vm.formData = {};
	vm.caseFormData = {};
	$scope.fileStore = {}
	vm.formData.uploadedDocs = [];
	vm.files = [];
	vm.caseSpecificCases = [];
	vm.categories = ['Intellectual Property', 'WebApp Technical', 'Other'];
	vm.specificCategories = ['Intellectual Property', 'Assisted Formality Filing', 'WebApp Technical', 'Other'];
	vm.subcategory = [];
	vm.checkSubcategories = checkSubcategories;
	vm.checkSpecificType = checkSpecificType;
	vm.formalitySelect = formalitySelect;
	vm.submitForm = submitForm;
	vm.submittingRequest = false;
	vm.specificCaseCheck = specificCaseCheck;
	vm.optionSelected = false;
	vm.caseSpecific = false;

	function specificCaseCheck(value, boolean) {
		vm.optionSelected = !boolean ? false : true;
		vm.caseSpecific = value == 'yes' && boolean ? true : false;
	}

   	function checkDuplicate(file) {
   		return vm.files.some(function(e){
   			return e.name == file.name;
   		})
	}

    $scope.getFileDetails = function (e, specific) {
    	
    	var timeout;
        var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];    	

        // $scope.$apply(function () {
            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
            	var ext = e.files[i].name.substr(e.files[i].name.lastIndexOf('.')+1);
 
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

			    	if(specific) {
			    		return e.files[i];
			    	}

			   		if(e.files[i].size > 0 && validFormats.includes(ext)) {
			   			vm.files.push(e.files[i])
			   		}
		   			
			   	}
            }
        // });
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

	function checkSpecificType(data) {
		vm.assistedFiling = data == 'Assisted Formality Filing' ? true : false
		vm.categorySelected = true;
	}

	//FOR CASE SPECIFIC https://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
	//https://laracasts.com/discuss/channels/javascript/formdata-append-javascript-array-jsonstringify-how-to-cast-as-php-array
	//https://stackoverflow.com/questions/54914593/appending-formdata-nested-object-along-with-a-file
	//https://stackoverflow.com/questions/24139216/how-can-i-serialize-an-input-file-object-to-json
	//https://stackoverflow.com/questions/43891966/send-array-value-on-javascript-but-it-show-as-object-object
	//https://stackoverflow.com/questions/50774176/sending-file-and-json-in-post-multipart-form-data-request-with-axios
	//https://stackoverflow.com/questions/34485420/how-do-you-put-an-image-file-in-a-json-object
	//https://www.learnwithjason.dev/blog/get-form-values-as-json
	//https://stackoverflow.com/questions/27232604/json-stringify-or-how-to-serialize-binary-data-as-base64-encoded-json
	//https://careerkarma.com/blog/javascript-object-object/



	var filesUploaded = [];

	function formalitySelect(patent) {

		console.log('patent : ', patent)

		var selectedPatent = patent;

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.add-information-for-case.tpl.htm'),
            scope: $scope,
            controllerAs:'$ctrl',
            controller: ['$uibModalInstance', function($uibModalInstance) {

            	//REQUIRES EDITING TO ACCOUNT FOR GRANTS WITH RENEWAL
            	
            	this.phoneNumber = $scope.ppDetails.partnerPhone;
            	this.applicationNo = patent.epApplicationNumber;
            	this.formalityType = patent.formalityAvailable;


                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

			   	function checkSpecificDuplicate(file) {
			   		return filesUploaded.some(function(e){
			   			return e.name == file.name;
			   		})
				}

				var caseFiles = [];

				const blobToBase64 = (blob) => {
					  	return new Promise((resolve) => {
					    	const reader = new FileReader();
					    	reader.readAsDataURL(blob);
					    	reader.onloadend = function () {
					      	resolve(reader.result);
					    };
					  });
					};


			    $scope.getSpecificFileDetails = function(e) {

					var timeout;
        			var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];    	

			    	var files = $scope.getFileDetails(e, 'specific');
			    	
		            for (var i = 0; i < e.files.length; i++) {
		            	var ext = e.files[i].name.substr(e.files[i].name.lastIndexOf('.')+1);
 
					   	if(checkSpecificDuplicate(e.files[i])) {
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

					   		if(e.files[i].size > 0 && validFormats.includes(ext)) {
					   			


					   			(async () => {

								  	const b64 = await blobToBase64(e.files[i]);
								  	const jsonString = JSON.stringify(b64);
						   			caseFiles.push(jsonString)
					   			})()

					   			filesUploaded.push(e.files[i])

					   			// vm.files.push(e.files[i])
					   			// console.log('caseFiles1111 : ', caseFiles)
					   		}
				   			
					   	}
					}


			    }



                this.add = function(data) {	

	            	var obj = {
	            		patentID: selectedPatent.patentID,
	            		epApplicationNumber: selectedPatent.epApplicationNumber,
	            		formalityAvailable: selectedPatent.formalityAvailable,
	            		isUrgent: true,
	            		isManualProcessing: true,
	            		message: data.message,
	            		numDocsUploaded: caseFiles.length,
	            		uploadedDocs: caseFiles
	            	}

                	vm.caseSpecificCases.push(obj);	

					$uibModalInstance.close();

                }
            }]
        });	

	}

	function submitForm(data, caseSpecific) {

		console.log('vm.caseSpecificCases', vm.caseSpecificCases)
		vm.submittingRequest = true;

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('category', data.category);
		// formData.append('test', JSON.stringify([{test: '1'}, {test: '2'}, {test: '3'}]))
		formData.append('patentEnquiries', JSON.stringify(vm.caseSpecificCases));


		var value = Object.fromEntries(formData.entries());

		console.log({ value });	


		for(var pair of formData.entries()) {
		   console.log(pair[0]+ ', '+ pair[1]);
		}		

		if(caseSpecific) {
			SupportService.requestSpecificSupport(formData, config)
			.then(
				function(response){

				},
				function(errResponse){

				}
			)
		}

		if(!caseSpecific) {


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

					vm.submittingRequest = false;

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

					vm.submittingRequest = false;

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

		

	} //submitform function end

	vm.patents = [
		{
		    "patentID": 321,
		    "epApplicationNumber": "EP17796838",
		    "formalityAvailable": "renewal",
		    "formalityStatus": "open for renewal",
		    "indicativeCost": 1200,
		    "isUrgent": true,
		    "isManualProcessing": false    
	  	},
		{
		    "patentID": 189,
		    "epApplicationNumber": "EP23946839",
		    "formalityAvailable": "epct",
		    "formalityStatus": "epct ready",
		    "indicativeCost": 4400,
		    "isUrgent": false,
		    "isManualProcessing": false    
	  	},
	  	{
		    "patentID": 200,
		    "epApplicationNumber": "EP44422448",
		    "formalityAvailable": "renewal",
		    "formalityStatus": "open for renewal",
		    "indicativeCost": 2200,
		    "isUrgent": false,
		    "isManualProcessing": false    
	  	}

  	]
}