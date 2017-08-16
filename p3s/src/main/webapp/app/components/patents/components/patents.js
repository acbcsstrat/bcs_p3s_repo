app.component('patents', {
  	bindings: { patents: '<' },
	templateUrl: 'p3sweb/app/components/patents/views/list-patents.htm',
	controller: function($state, $scope, Idle, Keepalive, $uibModal, $timeout, $location, $http) {

		var vm = this;

	   	vm.sortType     = 'patentApplicationNumber'; // set the default sort type
	  	vm.sortReverse  = false;  // set the default sort order

		$scope.started = false;

      	function closeModals() {
	        if ($scope.warning) {
	          $scope.warning.close();
	          $scope.warning = null;
	        }

	        if ($scope.timedout) {
	          $scope.timedout.close();
	          $scope.timedout = null;
	        }
      	}

      $scope.$on('IdleStart', function() {
        closeModals();

        $scope.warning = $uibModal.open({
          templateUrl: 'warning-dialog.html',
          windowClass: 'modal-danger'
        });
      });

      $scope.$on('IdleEnd', function() {
        closeModals();
      });

      var userTimedOut = false;

      var href=""
      var appUrl = domain;
  	

      	$scope.$on('IdleTimeout', function() {
        	closeModals();

     		userTimedOut = true;  

        // $scope.timedout = $uibModal.open({
        //   templateUrl: 'timedout-dialog.html',
        //   windowClass: 'modal-danger',
        // })

	        if (userTimedOut) {
	        	$http.post(appUrl+'resources/j_spring_security_logout')
	        	.then(
	        		function(){
		        		window.location = appUrl +'login';
	        		}    
	    		)    	
	        }

      	});

	}
	
});