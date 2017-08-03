app.component('patent', {
	bindings: { 
		patent: '<',
		graph: '<',
		renewal: '<'
	},
	templateUrl: 'p3sweb/app/components/patents/views/patent-item.htm',
	// controllerAs: 'graphDataController', this can be 
	controller: ['patentTabService', 'patentsService', '$state', function(patentTabService, patentsService, $state) {
		var vm = this;

	  	vm.tabs = patentTabService.tabs;
		vm.currentTab = patentTabService.currentTab;

	    vm.onClickTab = function(currentTab) {
	        patentTabService.onClickTab(currentTab);
	        vm.currentTab = patentTabService.currentTab;
	    };

	    vm.isActiveTab = function(tabUrl) {
	        return tabUrl == patentTabService.currentTab;
	    }

     	vm.selectedPatent = vm.patentItem;


     	//========== graphs

     	vm.$onChanges = function(changeObj){
            if(changeObj.patent){
             	vm.labels = vm.graph.label
     		  	vm.series = ['Series A', 'Series B'];
				vm.data = [vm.graph.data];
				vm.onClick = function (points, evt) {
			    	console.log(points, evt);
			  	};
			  	vm.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
			  	vm.options = {
			    	scales: {
			      		yAxes: [
				        	{
					          id: 'y-axis-1',
					          type: 'linear',
					          display: true,
					          position: 'left'
					        },
					        {
					          id: 'y-axis-2',
					          type: 'linear',
					          display: true,
					          position: 'right'
					        }
				      	]
				    }
			  	};
            }

            var checkBoxes = changeObj.patent.currentValue.notificationUIs;
        	var newArr = [];

        	function chunk(arr, size) {
        		for (i=0; i < arr.length; i+=size) {
	        		newArr.push(arr.slice(i, i+size));
	        	}
	        	return newArr;
        	}       	

        	vm.chunkedData = chunk(checkBoxes, 3);
            
        }





        //============ form data

     	vm.deletePatent = function(id){
     		console.log(id)
	        patentsService.deletePatent(id)
	            .then(function(){
	             	$state.go('app.patents', {}, {reload: true})
             	.then(function(){
	             		$timeout(function(){patentsService.fetchAllPatents()}, 400);
	             	})
	             },
	            function(errResponse){
	                console.error('Error while deleting Patent');
	            }
	        );
	    }

        vm.updatePatent = function(patent) {
        	var id = patent.id;
        	patentsService.updatePatent(patent, id);
        }

	    vm.editing=[];
	    
	    vm.editItem = function (index) {
	        vm.editing[index] = true;
	    }

	    vm.doneEditing = function (index) {
	        vm.editing[index] = false;
	    };
	  	
	}]

});