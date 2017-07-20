angular.module('myApp').component('user', {
  	bindings: { user: '<' },
	templateUrl: 'p3sweb/app/components/user/views/user-profile.htm',
	controller: ['userService', function(userService) {
		
		var vm = this;

//	  	vm.tabs = patentTabFactory.tabs;
//		vm.currentTab = patentTabFactory.currentTab;
//
//	    vm.onClickTab = function(currentTab) {
//	        patentTabFactory.onClickTab(currentTab);
//	        vm.currentTab = patentTabFactory.currentTab;
//	    };
//
//	    vm.isActiveTab = function(tabUrl) {
//	        return tabUrl == patentTabFactory.currentTab;
//	    }
//
//     	vm.selectedPatent = vm.patentItem;
//
//
//     	//========== graphs
//
//     	vm.$onChanges = function(changeObj){
//            if(changeObj.patent){
//             	vm.labels = vm.graph.label
//     		  	vm.series = ['Series A', 'Series B'];
//				vm.data = [vm.graph.data];
//				vm.onClick = function (points, evt) {
//			    	console.log(points, evt);
//			  	};
//			  	vm.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
//			  	vm.options = {
//			    	scales: {
//			      		yAxes: [
//				        	{
//					          id: 'y-axis-1',
//					          type: 'linear',
//					          display: true,
//					          position: 'left'
//					        },
//					        {
//					          id: 'y-axis-2',
//					          type: 'linear',
//					          display: true,
//					          position: 'right'
//					        }
//				      	]
//				    }
//			  	};
//            }
//        }

        //============ form data

        vm.updateUser = function(user) {
        	// console.log(event)
        	alert(' in user.js form submit action ');
//        	var id = user.id;
//        	userService.updateUser(user, id);
        	userService.updateUser(user);
        }

        vm.checkbox = {}
	  	
	}]
});