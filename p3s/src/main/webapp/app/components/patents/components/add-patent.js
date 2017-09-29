app.component('addpatent', {
	templateUrl: 'p3sweb/app/components/patents/views/add-patent.htm',
	controller: ['patentsService', '$state', '$stateParams', function(patentsService, $state, $stateParams) {

		var vm = this;

		vm.patent = $stateParams.obj;

	 	vm.submit = function(patent) {
	 		console.log(patent)
	    	patentsService.savePatent(patent)
	            .then(function(){
	             	$state.go('patents', {}, {reload: true})
	             	.then(function(){
		             		$timeout(function(){patentsService.fetchAllPatents()}, 400);
		             	})
		             },
		            function(errResponse){
		                console.error('Error while deleting Patent');
		            }
	        	)};
             	

        var checkBoxes = $stateParams.obj.notificationUIs;
    	var newArr = [];

    	function chunk(arr, size) {
    		for (i=0; i < arr.length; i+=size) {
        		newArr.push(arr.slice(i, i+size));
        	}
        	return newArr;
    	}       	

    	vm.chunkedData = chunk(checkBoxes, 3);

	}
]});




