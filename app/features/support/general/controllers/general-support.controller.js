GeneralSupportController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'SupportService', '$uibModal'];

export default function GeneralSupportController($scope, $state, $timeout, $stateParams, SupportService, $uibModal) {

	var vm = this;
	var filesUploaded = []; //required for checking duplicates

	vm.subCategoryRequired = false;
	vm.formData = {};
	$scope.caseFormData = {};
	$scope.caseFormData.uploadedDocs = [];
	$scope.fileStore = {}
	vm.formData.uploadedDocs = [];
	vm.files = [];
	$scope.allEnquiryCases = [];
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
	vm.caseSpecificCategory = '';
	$scope.removeSpecificFile = removeSpecificFile;
	var selectedPatent;
	var latestFileUploaded;



 	//entireSupportEnquiry 

 	//needs to hold array of all objects ready to sent to BE
 	//items need to be updated if user edits individualCase
 	//items need to be deleated if user requests they are deleted


 	//individualCase
 	//needs to create new Object that holds the individualCase property ready to be pushed to entireSupportEnquiry ready to submission
 	//case needs to be editable
 	//needs to check if duplicates in current individualCase
 	//needs to check if duplicates in the entireSupprtEnquiry



















	function fetchPatents(cat) {
		SupportService.requestSpecificPatents(cat)
		.then(
			function(response){
				vm.patents = response.patentEnquiries;
			},
			function(errResponse){
				console.error('controller errResponse', errResponse)
			}
		)

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

    function updateCheckBoxes(value) {
 
	  	Object.keys($scope.specificCase).forEach(function(key, o){
	  		if(key === value) {
	  			$scope.specificCase[key] = true; 
	  		} else {
	  			$scope.specificCase[key] = false;
	  		}
		});
    }	


	function warningCheckboxChange(newValue, oldValue) {

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

		modalInstance.result.then(function(value) {

			if(value) {//if they are confirming they want to change option and lose any data

				vm.caseSpecific = newValue;
				$scope.allEnquiryCases.length = 0;
				caseFiles.length = 0;
				filesUploaded.length = 0;

				$scope.caseFormData = {};

				vm.patents.forEach(function(item){ //required for removing css class in view
					item.selectedForEnquiry = false;
				})
				updateCheckBoxes(newValue)

			} else {
				vm.caseSpecific = oldValue;
				updateCheckBoxes(oldValue)
			}

    	})

	}

	function warningCategoryChange(newValue, oldValue) {

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

		modalInstance.result.then(function(value) {

			if(value) {//if they are confirming they want to change option and lose any data
				$scope.caseFormData = {};
				vm.caseSpecificCategory = newValue;
				$scope.caseFormData.category = newValue;
				$scope.allEnquiryCases.length = 0;
				caseFiles.length = 0;
				filesUploaded.length = 0;

				fetchPatents(newValue);

				vm.patents.forEach(function(item){ //required for removing css class in view
					item.selectedForEnquiry = false;
				})

			} else {
				vm.caseSpecificCategory = oldValue;
				$scope.caseFormData.category = oldValue;
			}

    	})

	}


	function specificCaseCheck(newValue, oldValue, boolean) {

		vm.optionSelected = !boolean ? false : true;
	
		if(newValue == oldValue) return;

		if($scope.allEnquiryCases.length > 0) { //if a case has been added to enquiry
			warningCheckboxChange(newValue, oldValue);
		} else {
			vm.caseSpecific = newValue;
		}

	}










	function removeSpecificFile(fileName) {

		var indexFilesUploaded = filesUploaded.map(x => {
		  return x.name;
		}).indexOf(fileName);

		var indexCaseFiles = caseFiles.map(x => {
		  return x.fileDetails.name;
		}).indexOf(fileName);

		var indexCaseHolder = $scope.caseHolder.map(x => {
		  return x.name;
		}).indexOf(fileName);

		caseFiles.splice(indexCaseFiles, 1)
		$scope.caseHolder.splice(indexCaseHolder, 1)
		filesUploaded.splice(indexFilesUploaded, 1)

	}


	function checkSpecificType(newValue, oldValue) { //category check 

		if(newValue == oldValue) return;

		vm.assistedFiling = newValue == 'Assisted Formality Filing' ? true : false
		vm.categorySelected = true;

		if($scope.allEnquiryCases.length > 0) { //if a case has been added to enquiry

			warningCategoryChange(newValue, oldValue);

		} else {
			fetchPatents(newValue);
			vm.caseSpecificCategory = newValue;
		}


	}	

   	function checkDuplicate(file, caseSpecific) {

   		if($scope.caseFormData.uploadedDocs.length == 0 && $scope.allEnquiryCases.length == 0) return false;

   		var individualCaseFiles = $scope.caseFormData.uploadedDocs.map(function(obj){ //caseFormData.uploadedDocs
   			return obj;
   		}).some(function(e){
   			return e.name == file.name;
   		})

   		var allCaseFiles = $scope.allEnquiryCases.map(function(item){ //allEnquiryCases
   			return item.uploadedDocs;
   		}).flat().some(function(e){
   			return e.name == file.name;
   		})

   		if(allCaseFiles || individualCaseFiles) {
   			return true;
   		}

   		return false;

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

		   	if(checkDuplicate(e.files[i], caseSpecific)) {
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
							};

						  	const b64 = await blobToBase64(e.files[i]);
						  	const jsonString = JSON.stringify(b64);		
						  	newObject.fileData = jsonString;

						  	$scope.caseFormData.uploadedDocs.push(newObject) //to be pushed for individualCase ADD

				   			$scope.$applyAsync(); //NEEDED				  	

			   			})()

			    	} else {
			   			vm.files.push(e.files[i]) //Required for no case specific cases
				   		
			    	}
			    }

	   			
		   	}
        }

    };

    function resetFormData() {
    	$scope.caseFormData = {};
    	$scope.caseFormData.uploadedDocs = []; //reset current case file as it has been added to allEnquiryCases
    }

	function formalitySelect(patent, type) { //handles both initial add and editing of patent

		selectedPatent = patent;

		if(type == 'delete') {
			var index = $scope.allEnquiryCases.map(x => {
			  return x.epApplicationNumber;
			}).indexOf(selectedPatent.epApplicationNumber);

			$scope.allEnquiryCases.splice(index, 1);
			return;
		}

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

            	if(type == 'edit') {
            		var findCase = $scope.allEnquiryCases.find(function(x){
            			return x.epApplicationNumber == selectedPatent.epApplicationNumber
            		})

        			$scope.caseFormData = findCase;
        			// $scope.caseFormData.files = patent.uploadedDocs;
            	}


                this.dismissModal = function () {
                    $uibModalInstance.close('notAdded');
                };

                this.add = function(data) {

                	if(type == 'edit') { //remove current patent that is being updated so it can be replaced with the new version
						var index = $scope.allEnquiryCases.map(x => {
						  	return x.epApplicationNumber;
						}).indexOf(selectedPatent.epApplicationNumber);

						$scope.allEnquiryCases.splice(index, 1);           		
         
                	}
    		
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
	            		isUrgent: selectedPatent.isUrgent,
	            		isManualProcessing: selectedPatent.isUrgent,
	            		message: data.message,
	            		numDocsUploaded: $scope.caseFormData.uploadedDocs.length,
	            		uploadedDocs: $scope.caseFormData.uploadedDocs
	            	}

	            	//need to identify correct files by comparing applicationNo

	            	if(vm.caseSpecificCategory == 'Assisted Formality Filing') {
	            		obj.indicativeCost = selectedPatent.indicativeCost;
	            	}

	            	resetFormData()

                	$scope.allEnquiryCases.push(obj);	//used to loop in FE

					$uibModalInstance.close();

                }
            }]
        });	

        modalInstance.result.then(function(value) {

        	if(value == 'notAdded') {
        		resetFormData();
        	}
        	//need to remove any files uploaded before adding
        })

	}

	function submitForm(data, caseSpecific) {

		vm.submittingRequest = true;

		var formData = new FormData();
		var config = { headers: {'Content-Type': undefined} };
		formData.append('category', data.category);
		formData.append('patentEnquiries', JSON.stringify($scope.allEnquiryCases));

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

			SupportService.requestNonSpecificSupport(formData, config)
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
		    "isManualProcessing": false,
		    "indicativeCost": 2010    
	  	},
		{
		    "patentID": 189,
		    "epApplicationNumber": "EP23946839",
		    "formalityAvailable": "epct",
		    "formalityStatus": "epct ready",
		    "indicativeCost": 4400,
		    "isUrgent": false,
		    "isManualProcessing": false,
		    "indicativeCost": 3870   
	  	},
	  	{
		    "patentID": 200,
		    "epApplicationNumber": "EP44422448",
		    "formalityAvailable": "renewal",
		    "formalityStatus": "open for renewal",
		    "indicativeCost": 2200,
		    "isUrgent": false,
		    "isManualProcessing": false,
		    "indicativeCost": 9999 
	  	}
  	]


}