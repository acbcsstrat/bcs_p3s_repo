ActionsAvailableController.$inject = ['$scope', '$timeout']

export default function ActionsAvailableController($scope, $timeout) {

	var vm = this;

	$scope.filter = {};

	var displayHelpTimeout;

    function noSubFilter(obj) {
        for (var key in obj) {
            if (obj[key]) { //if one of the $scope.filter ($scope.filter) properties evaluates to true (is selected) return false 
                return false;
            }
        }
        return true; //if no subfilters return true. This will result in all filtered data items being returned a true value
    }

    function checkArray(obj, service, prop) {
        return service.some(function(item) { //if filter[curretStageColour][red]
            return obj[prop][item[prop]] === true;
        })
    }


	$scope.$parent.promise
	.then(
		function(response){
            if($scope.firstTime) {
            	displayHelpTimeout = $timeout(function(){
            		$scope.displayHelp = true;
            	}, 2000)
            }

            if(response.length) {

		        response = response.map(function(patent){
		            return patent.p3sServices.map(function(serv){
		                return {                
		                    patentID: patent.patentID,
		                    ep_ApplicationNumber: patent.ep_ApplicationNumber,
		                    clientRef: patent.clientRef,
		                    p3sServices: [serv]
		                }
		            })
		        })

		        var result = [].concat.apply([], response);

				$scope.availableActions = result.filter(function(item){
					return item.p3sServices[0].saleType == 'Online' || item.p3sServices[0].saleType == 'Offline';
				})
				
				vm.chipOptions = [];
				vm.showFilter = showFilter;

			    function showFilter(mdMenu, $event) {
			 
			        mdMenu.open($event)
			        $scope.categories = ['saleType', 'currentStageColour', 'nextStageColour', 'serviceType'];     

			        //return items to filter panel
			        $scope.getItems = function (obj, array) { //obj is cat currentStageColour or serviceType
			            return (array || []).map(function (w) {
			                return w.p3sServices[0][obj]; //select property in p3sservices 
			            }).filter(function (w, idx, arr) {
			                if (typeof w === 'undefined' || w === null) {
			                    return false;
			                }
			                return arr.indexOf(w) === idx;
			            });
			        };

			        $scope.updateFiltered = function(prop, value, cat) {

			            if(value === true) {
			                if(cat === 'epct') {cat = 'Euro-PCT'};
			                vm.chipOptions.push({cat: cat, value: value, prop: prop})
			            } 
			            if(value === false) {
			                var index = vm.chipOptions.indexOf(cat);
			                vm.chipOptions.splice(index, 1);
			            }
			        }

			        $scope.closeDialog = function() {
			            $mdDialog.hide();
			        }

			    } //showFilter function end	

			    $scope.filterByPropertiesMatchingAND = function (data) { //all data sent from filter 
			        var matchesAND = true; //set macthes to true (default)

			        for (var obj in $scope.filter) { //$scope.filter is populated by $scope.filter within the panel controller below. Scope filter properties are initiated from front-end. currentStageColour/serviceType

			            if( $scope.filter.hasOwnProperty(obj) ) {
			                if (noSubFilter($scope.filter[obj])) continue; //Check if there are any sub filter options with the value of true, if so, break from loop to return value of true
			                if (!checkArray($scope.filter, data.p3sServices, obj)) { //If the property from the data matches the property from $scope.filter ($scope.filter) return false. It will not turn up in the table
			                    matchesAND = false;
			                    break; //break from the loop and return matchesAND which would now return false
			                }
			                
			            }
			        }
			        return matchesAND;
			    }; 				
            }

			$scope.$on('$destroy', function(){
				$timeout.cancel(dispayHelpTimeout);
			})
            
		}



	)
    
}