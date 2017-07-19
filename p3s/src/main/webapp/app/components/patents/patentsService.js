app.factory('patentsService', function($http, $q) {

    var factory = {};

		//var REST_SERVICE_URI = '../../p3sweb/assets/json/patents.json';
		var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-patents/';

        factory.fetchAllPatents = function() {
        
            var deferred = $q.defer();
             $http.get(REST_SERVICE_URI)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while fetching patents');
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        }

        factory.updatePatent = function(patent, id) {
            console.log(patent)

            var deferred = $q.defer();
            $http.put(REST_SERVICE_URI+id, patent)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while updating patent');
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }

        factory.fetchGraphData = function() {
        
            var deferred = $q.defer();
            $http.get('../../p3sweb/assets/json/cost-data.json')
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while fetching graph data');
                    deferred.reject(errResponse);
                }
            );

            return deferred.promise;
        }



    return factory;

});

app.factory('patentTabFactory', function() {

    var factory = {};

        factory.tabs = [{
            title: 'Patent Information',
            url: 'patent-info.htm'
        }, {
            title: 'Cost Analysis',
            url: 'cost-analysis.htm'
        }, {
            title: 'Renewal History',
            url: 'renewal-history.htm'
        }];

        factory.currentTab = 'patent-info.htm';

        factory.onClickTab = function (tab) {
            factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        }

        factory.isActiveTab = function(tabUrl) {
            return tabUrl == factory.currentTab; //for styling purposes
        }

    return factory;

});