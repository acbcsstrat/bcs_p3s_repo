export default angular.module('services.chunkdata-service', []).factory('ChunkDataService', ChunkDataService).name;

function ChunkDataService() {

	return {

		chunkData: function(arr, size) {

	    	var newArr = [];

    		for (var i=0; i < arr.length; i+=size) {
        		newArr.push(arr.slice(i, i+size));
        	}

        	return newArr;
	    	
		}

	}

}