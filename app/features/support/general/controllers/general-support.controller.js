GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'SupportService', '$uibModal'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, SupportService, $uibModal) {

	var vm = this;
	var filesUploaded = []; //required for checking duplicates
	var caseFiles = [];
	vm.subCategoryRequired = false;
	vm.formData = {};
	vm.caseFormData = {};
	$scope.fileStore = {}
	// $scope.specificSupportForm = {};
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
	vm.caseSpecific = '';

	function specificCaseCheck(newValue, oldValue, boolean) {
		console.log('CHECING')
		vm.optionSelected = !boolean ? false : true;
	
		if(newValue == oldValue) return;

		if(vm.caseSpecificCases.length > 0) { //if a case has been added to enquiry

	        var modalInstance = $uibModal.open({
	            template: require('html-loader!../html/modals/modal.loss-of-data.tpl.htm'),
	            scope: $scope,
	            controllerAs:'$ctrl',
                backdrop: 'static',
                keyboard: false,     
	            controller: ['$uibModalInstance', function($uibModalInstance) {
	                
	                this.dismissModal = function () {
	                    $uibModalInstance.close(false);
	                };

	                this.cancel  = function() {
	                	$uibModalInstance.close(false);
	                }

	                this.confirm  = function() {
	                	$uibModalInstance.close(true);
	                }

	            }]
	        })

	        function updateCheckBoxes(value) {
			  	Object.keys($scope.specificCase).forEach(function(key, o){
			  		if(key === value) {
			  			$scope.specificCase[key] = true; 
			  		} else {
			  			$scope.specificCase[key] = false;
			  		}
	  			});			        					
	        }

			modalInstance.result.then(function(value) {

				if(value) {//if they are confirming they want to change option and lose any data
					vm.caseSpecific = newValue;
					vm.caseSpecificCases.length = 0;

					vm.patents.forEach(function(item){ //required for removing css class in view
						item.selectedForEnquiry = false;
					})
					updateCheckBoxes(newValue)

					  	// return $scope.specificCase;
				} else {
					vm.caseSpecific = oldValue;
					updateCheckBoxes(oldValue)
				}

        	})

		} else {
			vm.caseSpecific = newValue;
		}

	}

	function checkSpecificType(data) {
		vm.assistedFiling = data == 'Assisted Formality Filing' ? true : false
		vm.categorySelected = true;
	}	

   	function checkDuplicate(file, caseSpecific) {
   		if(caseSpecific) {
	   		return filesUploaded.some(function(e){
	   			return e.name == file.name;
	   		})	
   		} else {
	   		return vm.files.some(function(e){
	   			return e.name == file.name;
	   		})

   		}
	}

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

    $scope.getFileDetails = function (e, caseSpecific) {

    	var timeout;
        var validFormats = ['pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'jpg', 'JPG', 'jpeg', 'JPEG','png', 'PNG', 'gif', 'GIF', 'pptx', 'PPTX', 'csv', 'CSV', 'xlsx', 'XLSX', 'zip', 'ZIP'];
        var blobToBase64 = (blob) => {
		  	return new Promise((resolve) => {
			    	const reader = new FileReader();
			    	reader.readAsDataURL(blob);
			    	reader.onloadend = function () {
			      	resolve(reader.result);
			    };
		  	});
		};

            // STORE THE FILE OBJECT IN AN ARRAY.
        for (var i = 0; i < e.files.length; i++) {
        	var ext = e.files[i].name.substr(e.files[i].name.lastIndexOf('.')+1);

		   	if(checkDuplicate(e.files[i], false)) {
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

			    	if(caseSpecific) {

	   					(async () => {

							var newObject  = {
							   'lastModified'     : e.files[i].lastModified,
							   'lastModifiedDate' : e.files[i].lastModifiedDate,
							   'name'             : e.files[i].name,
							   'size'             : e.files[i].size,
							   'type'             : e.files[i].type
							   // 'fileData'		  : jsonString
							};  	   						

						  	const b64 = await blobToBase64(e.files[i]);
						  	const jsonString = JSON.stringify(b64);
						  	newObject.fileData = jsonString;

							// // reCreate new Object and set File Data into it

				   			caseFiles.push(newObject)
			   			})()

		   				filesUploaded.push(e.files[i])

			    	} else {
			   			vm.files.push(e.files[i])
				   		
			    	}
			    }

	   			
		   	}
        }

    };

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


	

	function formalitySelect(patent) {

		var selectedPatent = patent;

        var modalInstance = $uibModal.open({
            template: require('html-loader!../html/modals/modal.add-information-for-case.tpl.htm'),
            scope: $scope,
            controllerAs:'$ctrl',
            backdrop: 'static',
            keyboard: false,              
            controller: ['$uibModalInstance', function($uibModalInstance) {

            	//REQUIRES EDITING TO ACCOUNT FOR GRANTS WITH RENEWAL
            	
            	this.phoneNumber = $scope.ppDetails.partnerPhone;
            	this.applicationNo = patent.epApplicationNumber;
            	this.formalityType = patent.formalityAvailable;


                this.dismissModal = function () {
                    $uibModalInstance.close();
                };

                this.add = function(data) {
    		
                	vm.patents.find(function(item){ //disable the row
					    if(selectedPatent.patentID === item.patentID) {
					        item.selectedForEnquiry = true;
					        return true;
					    }
					    return false;
                	})

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

		vm.submittingRequest = true;

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('category', data.category);
		formData.append('patentEnquiries', JSON.stringify(vm.caseSpecificCases));

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

}