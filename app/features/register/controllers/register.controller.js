RegisterController.$inject = ['$state', 'UserService', '$location', '$rootScope', 'vcRecaptchaService'];

export default function RegisterController($state, UserService, $location, $rootScope, vcRecaptchaService) {
    var vm = this;

    vm.formData = {};
    vm.recap = {};
    vm.displayBusinessDetail = false;
    vm.notSelectedCompanyReg = true;
    vm.checkFetchBusiness = checkFetchBusiness;
    vm.register = register;
    vm.searchCompany = searchCompany;
    vm.companyPinLoading = false;
    vm.recap.publicKey = '6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs'
    
    // function to process the form

    function init() {
        console.log(vcRecaptchaService)
        $state.go('register.user-details', {})
    }

    init()

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
        UserService.Create(vm.user)
            .then(function (response) {
                if(response.success) {
                    $state.go('login');
                } else {
                    vm.dataLoading = false;
                }
            });
    }
}