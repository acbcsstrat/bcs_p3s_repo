app.factory('chunkDataService', chunkDataService);

function chunkDataService() {

	return {

		chunkData: function(arr, size) {

	    	var newArr = [];

    		for (i=0; i < arr.length; i+=size) {
        		newArr.push(arr.slice(i, i+size));
        	}

        	return newArr;
	    	
		}

	}

}