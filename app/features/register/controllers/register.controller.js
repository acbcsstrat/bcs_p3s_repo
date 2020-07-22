RegisterController.$inject = ['$scope', '$state', 'UserService', '$location', '$rootScope', 'vcRecaptchaService', 'TimezoneService'];

export default function RegisterController($scope, $state, UserService, $location, $rootScope, vcRecaptchaService, TimezoneService) {
    var vm = this;

    vm.formData = {};
    vm.recap = {};
    vm.displayBusinessDetail = false;
    vm.notSelectedCompanyReg = true;
    vm.checkFetchBusiness = checkFetchBusiness;
    vm.register = register;
    vm.searchCompany = searchCompany;
    vm.copyBusinessAddress = copyBusinessAddress;
    vm.companyPinLoading = false;
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs';
    
    $scope.formParams = {};
    $scope.stage = "";
    $scope.formValidation = false;
    $scope.toggleJSONView = false;
    $scope.toggleFormErrorsView = false;
  
    // $scope.formParams = {
    //     ccEmail: '',
    //     ccEmailList: []
    // };
  
  // Navigation functions
    $scope.next = function (stage) { //https://codepen.io/jaa2015/pen/GqparY
        //$scope.direction = 1;
        //$scope.stage = stage;
        console.log(stage)
        $scope.formValidation = true;
        console.log($scope.registrationForm)
        if($scope.registrationForm.$valid) {
            $scope.direction = 1;
            $scope.stage = stage;
            $scope.formValidation = false;
        }
    };

    $scope.back = function (stage) {
        $scope.direction = 0;
        $scope.stage = stage;
    }; 
  
  // Post to desired exposed web service.
    $scope.submitForm = function () {
        var wsUrl = "someURL";

    // Check form validity and submit data using $http
        if ($scope.registrationForm.$valid) {
      $scope.formValidation = false;

      $http({
        method: 'POST',
        url: wsUrl,
        data: JSON.stringify($scope.formParams)
      }).then(function successCallback(response) {
        if (response
          && response.data
          && response.data.status
          && response.data.status === 'success') {
          $scope.stage = "success";
        } else {
          if (response
            && response.data
            && response.data.status
            && response.data.status === 'error') {
            $scope.stage = "error";
          }
        }
      }, function errorCallback(response) {
        $scope.stage = "error";
        console.log(response);
      });
    }
  };
  
  $scope.reset = function() {
    // Clean up scope before destorying
    $scope.formParams = {};
    $scope.stage = "";
  }





    function init() {
        $state.go('register.user-details', {})
        TimezoneService.fetchUsaTimeZones()
        .then(
            function(response){
                vm.ustimezones = response;
            }
        )        
    }

    init()

    function copyBusinessAddress(value) {

        if(value === true) {
            vm.formData.billingStreet = vm.formData.street;
            vm.formData.billingCity = vm.formData.city;
            vm.formData.billingState = vm.formData.state;
            vm.formData.billingZip = vm.formData.zip;
        } else {
            vm.formData.billingStreet = '';
            vm.formData.billingCity = '';
            vm.formData.billingState = '';
            vm.formData.billingZip = '';  
        }

    }

    function checkFetchBusiness(type, obj) {
        if(type == 'registered' && obj[type].yes == undefined) { //if user has selected that the company is already registered
            vm.displayBusinessDetails = false; //hide business form until they have fetched detgails of company
            vm.displayCompanyPIN = true; //display company fields to fetch company details
        } else {  //if user has indicated that is is the first person from the firm to register
            vm.displayBusinessDetails = true;
            vm.displayCompanyPIN = false; //hide company fields to fetch company details
        }
    }

    function searchCompany(pin, number) {
        console.log(pin, number)
        vm.companyPinLoading = true;
        console.log(vm.companyPinLoading)
        UserService.SearchCompany(pin, number)
        .then(
            function(response){
                vm.companyPinLoading = false;
                if(response.success) {
                    vm.displayBusinessDetails = true;
                    vm.displayCompanyPIN = false;
                    vm.searchCompanyresponse = response
                }
            }
        )
    }

    function register() {
        vm.dataLoading = true;
        console.log('hit')



        // UserService.Create(vm.user)
        //     .then(function (response) {
        //         if(response.success) {
        //             $state.go('login');
        //         } else {
        //             vm.dataLoading = false;
        //         }
        //     });
    }
}