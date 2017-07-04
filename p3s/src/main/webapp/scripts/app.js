var app = angular.module('myApp', ['ngRoute', 'angularMoment', 'ui.router', "chart.js"]);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider ) {

    $urlRouterProvider
                  .when('', '/patents/list-patents')
                  .when('/', '/patents/list-patents')
                  .when('/patents', '/patents/list-patents')
                  .when('/transactions', '/transactions/current-transactions')
                  .otherwise('/patents/list-patents');

    $stateProvider
    .state("user-profile", {
        url: "/user-profile",
        templateUrl: "http://localhost:8080/p3sweb/templates/user-profile.htm",
        controller: "userProfileCtrl"
    })
    .state("list-users", {
        url: "/list-users",
        templateUrl: "http://localhost:8080/p3sweb/templates/list-users.htm",
        controller: "userProfileListCtrl"
    })
    .state("patents", {
        url: "/patents",
        templateUrl: "http://localhost:8080/p3sweb/templates/patents/patent-nav.htm",
        controller: "patentCtrl"
    })
    .state("patents.list", {
        url: "/list-patents",
        templateUrl: "http://localhost:8080/p3sweb/templates/patents/list/list-patents.htm",
        controller: "patentCtrl"
    })

    .state("patents.list.item", {
        url: "/patent-item",
        templateUrl: "http://localhost:8080/p3sweb/templates/patents/list/patent-item.htm",
        params: {
            id: null,
            patentApplicationNumber: null,
            clientRef: null,
            renewalStatus: null,
            currentRenewalCost: null,
            costBandEndDate: null,
            renewalCostNextStage: null,
            renewalDueDate: null,
            shortTitle: null,
            primaryApplicantName: null,
            patentPublicationNumber: null,
            title: null,
            filingDate: null,
            epoPatentStatus: null
        },
        controller: "patentCtrl"
    })


    
    .state("search-epo-for-patent", {
        url: "/search-epo-for-patent",
        templateUrl: "http://localhost:8080/p3sweb/templates/patents/add/search-epo-for-patent.htm",
        controller: "addPatentCtrl"
    })
    .state("add-patent", {
        url: "/add-patent",
		params: {
			obj: null
		},
		templateUrl: "http://localhost:8080/p3sweb/templates/patents/add/new-patent-reviewed.htm",
        controller: "addPatentCtrl"
    })

    
    
    
    
    .state("transactions", {
        url: "/transactions",
        templateUrl: "templates/transactions/transaction-nav.htm",
        controller: "transCtrl"
    })
    .state("transactions.current", {
        url: "/current-transactions",
        templateUrl: "templates/transactions/current/current-transactions.htm",
        controller: "transCtrl"
    })
    .state("transactions.current.item", {
        url: "/current-transaction-item",
        templateUrl: "templates/transactions/current/current-transaction-item.htm",
        controller: "transCtrl"
    })
    .state("transactions.current.status", {
        url: "/current-transaction-status",
        templateUrl: "templates/transactions/current/current-transaction-status.htm",
        controller: "transCtrl"
    })
    .state("transactions.history", {
        url: "/transaction-history-status",
        templateUrl: "templates/transactions/history/transaction-history.htm",
        controller: "transCtrl"
    })
    .state("transactions.history.item", {
        url: "/transaction-history-item",
        templateUrl: "templates/transactions/history/transaction-history-item.htm",
        controller: "transCtrl"
    })
    .state("transactions.history.status", {
        url: "/transaction-history-status",
        templateUrl: "templates/transactions/history/transaction-history-status.htm",
        controller: "transCtrl"
    })        

    // $locationProvider.html5Mode(true).hashPrefix(''); //not needed when using ui-router

}]);

app.run(function($rootScope) {
    $rootScope.select = function(item) { 
        $rootScope.patentItem = []; 
        $rootScope.patentItem.push(item); 
    }
})
           
app.factory('loadPatents', function($http, $q) {

    var factory = {};

    var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-patents/';

    factory.fetchAllPatents = function() {
        
    	//alert(' GET ALL');
    	var deferred = $q.defer();
         $http.get(REST_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Users');
                deferred.reject(errResponse);
            }
        );

        return deferred.promise;
    }

    factory.createPatent = function(patent) {
    	alert(' CREATE PATENT');
    	patent.id = '99';
    	alert(' CREATE PATENT2');
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, patent)
            .then(
            function (response) {
            	alert(' CREATE PATENT aa ');
                deferred.resolve(response.data);
            },
            function(errResponse){
            	alert(' CREATE PATENT vbbb');
                console.error('Error while creating User');
                deferred.reject(errResponse);
            }
        );
    	alert(' CREATE PATENT ccc');
        return deferred.promise;
    }

    factory.deletePatent = function(id) {
        console.log('trying to delete')
        var deferred = $q.defer();
        console.log(REST_SERVICE_URI+id)
        $http.delete(REST_SERVICE_URI+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    return factory;
})

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

app.controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
  
  // Simulate async data update
  $timeout(function () {
    $scope.data = [
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40]
    ];
  }, 3000);
   
}])














app.service('patentService', ['$http', function($http) {
    var patentService = this, i;

    patentService.items = $http.get("http://localhost:8080/p3sweb/rest-patents/");
    
    return {
        items: patentService.items,
    }
}])







app.controller('patentCtrl', ['$scope', '$http', 'loadPatents', '$stateParams', 'patentService', 'patentTabFactory', function($scope, $http, loadPatents, $stateParams, patentService, patentTabFactory) {

    $scope.patent={id:null, patentApplicationNumber:'', clientRef: '', renewalStatus: '', currentRenewalCost: '', costBandEndDate:'', renewalCostNextStage:'', renewalDueDate:''};
    $scope.patents=[];
    $scope.submit = $scope.submit;
    $scope.remove = $scope.remove;

    $scope.fetchAllPatents = function(){
        loadPatents.fetchAllPatents()
            .then(
            function(d) {
                $scope.patents = d;
                console.log('yeah')
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }

    $scope.fetchAllPatents();

    $scope.deletePatent = function(id){
        loadPatents.deletePatent(id)
            .then(
             $scope.fetchAllPatents,
            function(errResponse){
                console.error('Error while deleting Patent');
            }
        );
    }

    $scope.submit = function() {
        if($scope.patent.id===null){
            console.log($scope.patent);
            loadPatents.createPatent($scope.patent);
        }
        console.log($scope.patent.id);
        
    }

    $scope.remove = function(id){
        console.log('id to be deleted', id);
        if($scope.patent.id === id) {//clean form if the patent to be deleted is shown there.
            reset();
        }
         $scope.deletePatent(id);
    }

    $scope.tabs = patentTabFactory.tabs;
    $scope.currentTab = patentTabFactory.currentTab;

    $scope.onClickTab = function(currentTab) {
        patentTabFactory.onClickTab(currentTab);
        $scope.currentTab = patentTabFactory.currentTab;
    };

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == patentTabFactory.currentTab;
    }


     $scope.selectedPatent = $scope.patentItem;

}]);

























app.factory('fxRate', ['$http', '$q', function($http, $q){

    var factory = {};

    factory.getFx = function() {
        return $http.get('../json/mcfx.json');
    }

    return factory;

}]);



app.controller('userController', ['$scope', '$http', function($scope, $http) {

    $http.get('../json/timezones.json').then(function(response) {
        $scope.timezone = response.data.timezones;
    });

}]);


app.factory('userProfileService', ['$http', '$q', function($http, $q) {

    var factory = {};

        var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-user/';

        factory.getUser = function() {
            var deferred= $q.defer();
            
            $http.get(REST_SERVICE_URI)
                .then(function(response){
                	console.log('success')
                    deferred.resolve(response.data);

                }, function(errResponse) {
                    console.log('error');
                    deferred.reject(errResponse)
                }
            );
            
            
            return deferred.promise;
        }
        
        factory.updateUser = function(user) {
            var deferred = $q.defer();
            $http.put(REST_SERVICE_URI, user)
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error while creating User');
                    console.log(errResponse);
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }

        factory.getUsers = function() {
        	//alert("Inside getUsers");
        	
        	var REST_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-users/';
            var deferred= $q.defer();
            
            $http.get(REST_SERVICE_URI)
                .then(function(response){
                	console.log('success')
                    deferred.resolve(response.data);
                	console.log('exit')

                }, function(errResponse) {
                    console.log('error');
                    deferred.reject(errResponse)
                }
            );
            
            console.log('returning')
            return deferred.promise;
        }

    return factory;

}])





app.controller('userProfileCtrl', ['$scope', 'userProfileService', function($scope, userProfileService) {

    $scope.fetchUser = function(){
        userProfileService.getUser()
            .then(
            function(d) {
            	
                $scope.user = d;
                console.log($scope.user)
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }
    
    
    $scope.submit = function() {
    	alert("Inside sub,it() in app.js");
    	userProfileService.updateUser($scope.user);
        console.log($scope.user.id);
    }
    
    

    $scope.fetchUser();
    

}])


app.controller('userProfileListCtrl', ['$scope', 'userProfileService', function($scope, userProfileService) {
	//alert("Inside common");
	 
	 
    $scope.fetchUsers = function(){
    	//alert("Inside fetchUsers");
    	userProfileService.getUsers()
            .then(
            function(d) {
            	
                $scope.users = d;
                console.log($scope.users.firstName)
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }
    
    $scope.fetchUsers();
   
    
}]);


app.controller('addPatentCtrl', ['$scope', 'addPatentService', '$state', function($scope, addPatentService, $state) {

	$scope.goSearchEpo = function() {
		$state.go('add-patent', {obj: $scope.patent.patentApplicationNumber});
    }
	
    $scope.fetchCandidatePatent = function(){
    	// why does this get called twice ?
    	//alert('in fetchCandidatePatent - about to search for '+$state.params.obj);
    	var searchPatentApplicationNumber = $state.params.obj;
    	//alert('searchPatentApplicationNumber is also '+searchPatentApplicationNumber);

    	addPatentService.findPatent(searchPatentApplicationNumber)
        .then(
	        function(d) {
	            $scope.patent = d;
	            console.log('JJJ');
	            ///console.log($scope.patent)
	        },
	        function(errResponse){
	            console.error('Error while finding patent');
	        }
        );
    }

	
    $scope.submit = function() {
    	addPatentService.savePatent($scope.patent);
    	console.log($scope.patent.patentApplicationNumber);

    	// pmdToDo : Will be code here for: No Match Found. Try again?
    	
    	//alert('finally: ToDo - goto dashboard ');
    	$state.go('patents.list');   //    	/patents/list-patents
    }
    
    $scope.fetchCandidatePatent();
}])







app.factory('addPatentService', ['$http', '$q', function($http, $q) {
    var factory = {};

        var REST_SEARCH_PATENT_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-search-patents/';

        factory.findPatent = function(searchName, $scope) {
            var deferred= $q.defer();

            var fred = REST_SEARCH_PATENT_SERVICE_URI + searchName;
            
            $http.get(fred)
                .then(function(response){
                	console.log('add patent success');
                	deferred.resolve(response.data)
                }, function(errResponse) {
                    console.log('add patent error');
                    deferred.reject(errResponse)
                }
            );
            return deferred.promise;
        }

        
        
        var REST_SAVE_PATENT_SERVICE_URI = 'http://localhost:8080/p3sweb/rest-patents/';

        factory.savePatent = function(patent) {
        	var deferred= $q.defer();
            $http.post(REST_SAVE_PATENT_SERVICE_URI, patent)
                .then(function(response){
                	console.log('save patent success')

                }, function(errResponse) {
                    console.log('save patent error');
                    deferred.reject(errResponse)
                }
            );
            return deferred.promise;
        }
        return factory;

}])












app.factory('transTabFactory', function() {

    var factory = {};

    factory.tabs = [{
        title: 'Transaction Item',
        url: 'current-trans-info.htm'
    }, {
        title: 'Transaction status',
        url: 'transaction-status.htm'
    }];

    factory.currentTab = 'current-trans-info.htm';

    factory.onClickTab = function (tab) {
        factory.currentTab = tab.url; //the tabs array is passed as a parameter from the view. The function returns the url property value from the array of objects.
        // console.log(tab.url);
    }

    factory.isActiveTab = function(tabUrl) {
        return tabUrl == factory.currentTab; //for styling purposes
    }
 
    return factory;

});


app.controller('transCtrl', ['$scope', '$http', 'transTabFactory', function($scope, $http, transTabFactory) {
    $http.get('../json/transactions.json')
    .then(function(response){
        $scope.transaction = response.data.transactions;
    }, function(errResponse){
        console.log('error');
    });

    $scope.sortType     = 'transId'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchTrans   = '';     // set the default search/filter term

    $scope.tabs = transTabFactory.tabs;
    $scope.currentTab = transTabFactory.currentTab;
     // $scope.isActiveTab = transTabFactory.isActiveTab();
    $scope.onClickTab = function(currentTab) {
        transTabFactory.onClickTab(currentTab);
        $scope.currentTab = transTabFactory.currentTab;
    };

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == transTabFactory.currentTab;
    }


  
}]);







app.controller('dashboard', ['$scope', 'fxRate', 'moment', function($scope, fxRate, moment){

    $scope.dailyFx = function() {

        fxRate.getFx().then(function(response) {
          // Extract the USD to EUR rate from the returned response
            var rates = response.data.fxrate.map(function(rate) {
                return rate.usdToEur;
            });

            // Grab the last and previous elements
            var last_el = rates[rates.length - 1];
            var prev_el = rates[rates.length - 2];         

            $scope.todayFxRate = last_el;
            $scope.yestFxRate = prev_el;

            if(last_el > prev_el) {
                $scope.fxindicator = 'fa fa-caret-up';
            } else {
               $scope.fxindicator = 'fa fa-caret-down';
            }        
        });
    }

   $scope.date = new moment();

    moment.tz.add([
        'America/Jamaica|KMT EST EDT|57.b 50 40|0121|1Lzm0 1zb0 Op0',
        'Europe/London|GMT BST BDST|0 -10 -20|0101|1Lz50 1zb0 Op0'
    ]);

    $scope.startTime = function () {

        //cet
        var ceTime = moment().tz('Europe/London').format('MMMM YYYY HH:mm:ss');
        var cetoday = new Date(ceTime);
        var ceh = cetoday.getHours();
        var cem = cetoday.getMinutes();
        var ces = cetoday.getSeconds();
        ceh = $scope.checkTime(ceh);
        cem = $scope.checkTime(cem);
        ces = $scope.checkTime(ces);
        document.getElementById('cetClock').innerHTML =
        ceh + ":" + cem + ":" + ces;

        //est
        var esTime = moment().tz('America/Jamaica').format('MMMM YYYY HH:mm:ss');
        var estoday = new Date(esTime);
        var esh = estoday.getHours();
        var esm = estoday.getMinutes();
        var ess = estoday.getSeconds();
        esh = $scope.checkTime(esh);
        esm = $scope.checkTime(esm);
        ess = $scope.checkTime(ess);
        document.getElementById('estClock').innerHTML =
        esh + ":" + esm + ":" + ess;

        var t = setTimeout($scope.startTime, 500);
    }

    $scope.checkTime = function(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    

    $scope.startTime();
    $scope.dailyFx();

}])

