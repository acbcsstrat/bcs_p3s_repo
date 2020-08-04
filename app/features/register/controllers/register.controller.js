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
    vm.searchCompanyresponse;
    $scope.formParams = {};
    $scope.business = {}
    $scope.stage = "";
    $scope.formValidation = false;
    $scope.toggleJSONView = false;
    $scope.toggleFormErrorsView = false;
  
  // Navigation functions
    $scope.next = function (stage) { //https://codepen.io/jaa2015/pen/GqparY
        //$scope.direction = 1;
        //$scope.stage = stage;
        console.log('stage : ', stage)
        $scope.formValidation = true;
        console.log('$scope.registrationForm : ', $scope.registrationForm)
        if($scope.registrationForm.$valid) {
            console.log('valid')
            $scope.direction = 1;
            $scope.stage = stage;
            $scope.formValidation = false;
            console.log('$scope.stage : ', $scope.stage)
        }
    };

    $scope.back = function (stage) {
        $scope.direction = 0;
        $scope.stage = stage;
    }; 
  
    $scope.reset = function() {
        // Clean up scope before destorying
        $scope.formParams = {};
        $scope.stage = "";
    }

    function init() {
        $scope.stage1 =  false;
        $scope.stage2 = false;
        vm.companyDetailsRequired = false;
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
            vm.formData.billingState = vm.formData.USstate;
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

            vm.companyDetailsRequired = true;
            vm.displayBusinessDetails = false; //hide business form until they have fetched detgails of company
            vm.displayCompanyPIN = true; //display company fields to fetch company details
        } else {  //if user has indicated that is is the first person from the firm to register
            vm.companyDetailsRequired = false;            
            vm.displayBusinessDetails = true;
            vm.displayCompanyPIN = false; //hide company fields to fetch company details
        }
    }

    function searchCompany(pin, number) {

        vm.companyPinLoading = true;

        UserService.SearchCompany(pin, number)
        .then(
            function(response){

                vm.companyPinLoading = false;
                vm.noCompany = false;
                vm.searchCompanyresponse = response;
                vm.hideSearchBtn = true;
                vm.acceptDetails = function() {
                    vm.displayBusinessDetails = true;
                    vm.displayCompanyPIN = false;
                    Object.keys(response.message).map(function(o, k){
                        vm.formData[o] = response.message[o];
                    })
                    $scope.selectedItemvalue = response.message.timezone;
                }

                vm.declineDetails = function() {
                    $scope.business.company.yes = false; //reset checkboxes
                    $scope.business.notcompany.yes = false;
                    vm.searchCompanyresponse = undefined;
                    vm.displayBusinessDetails = false;
                    vm.displayCompanyPIN = true;
                    vm.hideSearchBtn = false;                
                }
                
            
            },
            function(errResponse) {
                console.log('error : ', errResponse);
                vm.companyPinLoading = false;
                vm.noCompany = true;
            }
        )
    }

    function register() {
        console.log('vm.formData : ', vm.formData)
        console.log($scope.registrationForm)
        vm.dataLoading = true;
        if($scope.registrationForm.$valid) {
            $scope.formValidation = false;
            UserService.Create(vm.formData)
            .then(
                function(response) {
                    console.log('response : ', response)
                    if(response.success) {
                        $state.go('login');
                    } else {
                        vm.dataLoading = false;
                    }
                },
                function(errResponse){
                    console.log(errResponse)
                }
            );

        }

    }
}