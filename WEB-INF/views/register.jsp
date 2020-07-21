<!doctype html>
<html lang="en">

   <head>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

        <link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

        <link rel="stylesheet" type="text/css" href="assets/css/style.css">

        <script src="https://www.google.com/recaptcha/api.js" async defer></script>        

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/parsley.js/2.8.0/parsley.min.js"></script>

        <title>Patent Place</title>

        <style id="antiClickjack">body{display:none !important;}</style>

        <script type="text/javascript">

            if(self === top) {
                var antiClickjack = document.getElementById("antiClickjack");
                antiClickjack.parentNode.removeChild(antiClickjack)
            } else {
                top.location = self.location
            }

        </script>


    </head>

   <body class="bg-light-grey2"> 
      <div class="d-flex justify-content-center align-items-center content-panel">
         <div class="container-pre-app__center-box-40">
            <div class="content-panel__body bg-white p-t-xxxl p-b-xxxl p-r-6 p-l-6">
                <div class="row">
                    <div class="col-xl-12 text-center">
                        <img src="assets/imgs/logos/pp-logo-text-black.png" alt="patent place logo with text" width="200" class="m-b-lg">
                    </div>  
               </div> 
               <div class="row m-b-lg">
                  <div class="col-md-12 text-center">
                        <h1 class="font-h1 font-weight-light">Register an account</h1>
                    </div>
                </div>
<!--                <div class="row m-b-lg">
                    <div class="col-md-12 text-center">
                         <div class="d-flex justify-content-center">                     
                            <p class="font-body m-r-xs">Need to <a href="/p3sweb/login" class="inline-link font-weight-medium">Login</a>?</p>
                            
                        </div>                        

                    </div>
                </div> -->
<!--                      </div>
                </div> --> 
                <div id="register-intro">
                    <div class="row" id="divQn">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <span class="font-h4 font-weight-medium m-r-md">Has your firm already registered?</span>
                            <label class="form-check-label font-h4 m-r-sm">Yes<input class="m-l-xs" type="radio" name="typeRegister" id="subRegister"></label>
                            <label class="form-check-label font-h4">No<input class="m-l-xs" type="radio" name="typeRegister" id="initalRegister"></label>
                        </div>
                    </div>                  
                </div>

                <div id="initialRegistration" class="m-t-md d-none">
                    <div class="row">
                        <div class="col-xl-12">
                            <form name="register" id="registerForm" class="form" data-parsley-validate="">
<!--                                 <div class="form-section current m-b-sm">
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input name="emailAddress" class="form-control pill-radius font-body" id="emailAddress" placeholder="Email" data-parsley-validate-email="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="text" name="firstName" class="form-control pill-radius font-body" id="firstName" placeholder="First Name" data-parsley-validate-name="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="text" class="form-control pill-radius font-body" name="lastName"  id="lastName" placeholder="Last Name" data-parsley-validate-name="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="password" name="password" class="form-control pill-radius font-body" id="password" placeholder="Password" data-parsley-length="[8, 20]" data-parsley-length-message="Your password needs to be between 8 and 20 characters long." data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <ul id="passwordStrength" class="p-none m-none">
                                                <li class="point" data-matched-class="first"></li>
                                                <li class="point" data-matched-class="second"></li>
                                                <li class="point" data-matched-class="third"></li>
                                                <li class="point" data-matched-class="fourth"></li>
                                            </ul>                                                           
                                        </div>
                                    </div>
                                    <div class="form-group row m-b-none">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="password" name="confirm_password" class="form-control pill-radius font-body" id="confirm_password" placeholder="Confirm Password" data-parsley-equalto-message="Your passwords don't match.  Please re-enter." data-parsley-equalto="#password" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true" autocomplete="off">
                                        </div>
                                    </div>
                                </div>  -->                                                 
<!--                                 <div class="form-section m-b-md" id="businessDetails"> 
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="text" name="businessName" class="form-control pill-radius font-body" id="businessName" placeholder="Business Name" data-parsley-validate-company-name="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <input type="text" name="phoneNumber" class="form-control pill-radius font-body" id="phoneNumber" data-parsley-validate-phone="" placeholder="Business Tel" data-parsley-minlength="10" data-parsley-minlength-message="This fields value has a minimum length of 10 characters." data-parsley-maxlength-messsage="This fields value has a maximum length of 40 characters." data-parsley-maxlength="40" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">     
                                        </div>
                                    </div>
                                    <div id="subBusiness">
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="street" class="form-control pill-radius font-body" id="street" placeholder="Business Street" data-parsley-validate-address="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="city" class="form-control pill-radius font-body" id="city" placeholder="Business City" data-parsley-validate-address="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="USstate" class="form-control pill-radius font-body" id="USstate" placeholder="Business State" data-parsley-required-message="Please ensure this field has been completed." data-parsley-validate-address="" data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-6 col-lg-6 col-xl-6">
                                                <input type="text" name="zip" class="form-control pill-radius font-body" id="zip" placeholder="Business Zip" data-parsley-validate-zip="" data-parsley-maxlength="10" data-parsley-maxlength-message="This fields value has a maxium length of 10 characters." data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                            <div class="col-md-6 col-lg-6 col-xl-6">
                                                <select class="form-control pill-radius font-body form-control" name="timezone" id="timezone" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                                    <option value="" selected disabled hidden class="txt-grey">Time Zone</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
                                <div class="form-section">
                                    <div id="sameAsBusiness" class="row m-b-md">
                                        <div class="col-md-12 col-lg-12 col-xl-12">
                                            <div class="row m-t-xs">
                                                <div class="col-md-12 col-lg-12 col-xl-12">
                                                    <div class="onoffswitch d-flex align-items-center justify-content-between">
                                                        <span class="font-body font-weight-medium m-r-sm">Billing same as business address?</span>
                                                        <label class="switch font-body">
                                                            <input type="checkbox" name="same_as_business" id="same_as_business">
                                                            <span class="slider round"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="pasteBusiness">
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="billingStreet" class="form-control pill-radius font-body" id="billing_street" placeholder="Billing Street" data-parsley-validate-address="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="billingCity" class="form-control pill-radius font-body" id="billing_city" placeholder="Billing City" data-parsley-validate-address="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="billingState" class="form-control pill-radius font-body" id="billing_state" placeholder="Billing State" data-parsley-validate-address="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12 col-lg-12 col-xl-12">
                                                <input type="text" name="billingZip" class="form-control pill-radius font-body" id="billing_zip" placeholder="Billing Zip"  data-parsley-validate-zip="" data-parsley-maxlength="10" data-parsley-maxlength-message="This fields value has a maxium length of 10 characters." data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row m-b-sm">
                                        <label class="form-check-label font-body col-md-12 col-lg-12 col-xl-12 text-center">
                                            I accept the <a href="http://thepatent.place/terms/" target="__blank" class="font-weight-medium inline-link">Terms and Conditions</a>
                                            <input type="checkbox" name="terms-register" id="terms-register" data-parsley-required-message="Please read and accept out terms and conditions" data-parsley-required="true">      
                                        </label>                                    
                                    </div>
                                    <div class="row m-b-sm">
                                        <div class="col-md-12 col-lg-12 col-xl-12">                                    
                                            <div class="g-recaptcha d-flex justify-content-center" data-sitekey="6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs" data-callback="recaptchaCallback" disabled="disabled"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12 col-lg-12 col-xl-12">
                                        <div class="form-navigation d-flex justify-content-between">
                                            <button type="button" class="previous btn btn--green btn--lg pill-radius">Previous</button>
                                            <button type="button" class="next btn btn--green btn--lg pill-radius">Next</button>
                                            <input type="submit" value="Register" id="register" class="btn btn--green btn--lg pill-radius" disabled>
                                        </div>                                          
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div id="register-success" class="d-none">
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
                            <h3 class="font-h2 font-weight-bold txt-phase-green m-b-sm">Successful</h3>
                            <p class="font-h4 text-center w-100">You have successfully registered your details. Please check your inbox to verify your account before logging in.</p>
                        </div>
                    </div>                              
                </div>

                <div id="register-failure" class="d-none">
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center py-5 px-3">
                            <h3 class="font-h2 font-weight-bold txt-phase-red  m-b-sm">Unsuccessful</h3>
                            <p class="font-h4 text-center w-100">We were unable to register your details. Please try <a class="inline-link font-weight-medium font-h4" href="/p3sweb/register">registering</a> again. If it's still a problem then please let us know : support@ip.place</p>
                        </div>
                    </div>
                </div>      

                <div id="companyCode" class="d-none">
                    <div class="row m-t-md">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <form name="companyCodeForm" id="companyCodeForm">
                                <div class="form-group row">
                                    <div class="col-md-12 col-lg-12 col-xl-12">
                                        <input data-parsley-type="alphanum" class="form-control pill-radius font-body" name="businessNumber" placeholder="Company Number" data-parsley-type-message="Only letters and numbers are valid charcters in this field."  data-parsley-maxlength="6" data-parsley-maxlength-message="This fields value has a maximum length of 6 characters." data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-12 col-lg-12 col-xl-12">
                                        <input class="form-control pill-radius font-body" name="businessPin" placeholder="Company PIN" data-parsley-type="digits" data-parsley-type-message="Only numbers are valid charcters in this field." data-parsley-range="[100, 9999]"  data-parsley-range-message="Invalid PIN entered. Please try again." data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true">
                                    </div>
                                </div>
                                <div id="businessValidation">
                                </div>                                          

                                <div class="form-group row m-t-md">
                                    <div class="col-md-12 col-xl-12 text-right">
                                        <input type="submit" name="companyCodeSubmit" id="companyCodeSubmit" class="btn btn--lg btn--green pill-radius" value="Search">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div id="businessConfirm" class="d-none">
                    <div class="row m-t-md">
                        <div class="col-md-12 col-lg-12 col-xl-12">                         
                            <div class="m-b-xs text-xl-center">
                                <p class="font-h4 font-weight-medium">Details Found</p>
                            </div>
                            <div class="m-b-sm">
                                <table class="font-body">
                                    <tr>
                                        <td class="bg-white pill-radius form-control font-body m-b-sm" id="businessNameConfirm"></td>
                                    </tr>
                                    <tr>
                                        <td class="bg-white form-control font-body pill-radius-textarea">
                                            <span id="businessAddressStreetConfirm"></span><br>
                                            <span id="businessAddressCityConfirm"></span><br>
                                            <span id="businessAddressStateConfirm"></span><br>
                                            <span id="businessAddressZipConfirm"></span>
                                        </td>
                                    </tr>                                           
                                </table>                                    
                            </div>
                            <div class="row m-b-sm">
                                <div class="col-md-12 col-lg-12 col-xl-6 d-flex justify-content-between align-items-center">
                                    <p class="font-weight-bold font-body m-r-sm">Are the details correct?</p>
                                </div>
                                <div class="col-md-12 col-lg-12 col-xl-6 d-flex justify-content-md-between justify-content-lg-end justify-content-xl-end">
                                    <input type="button" id="businessConfirmSubmit" name="businessConfirmSubmit" class="btn btn--lg btn--green pill-radius m-r-sm" value="Yes">
                                    <input type="button" id="businessCancel" name="businessCancel" class="btn btn--lg btn--red pill-radius" value="No">
                                </div>              
                            </div>
                        </div>
                    </div>  
                </div>
            </div>                              
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/2.8.1/jquery.serializejson.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>          

        <script>

            var domain = 'http://localhost:8080/p3sweb/';

            var captchaChecked = false;

            function recaptchaCallback() {

                var btnSubmit = $('#register');

                var response = grecaptcha.getResponse();

                if(response.length > 0 && $('#terms-register').prop('checked')) {
                    captchaChecked = true;
                    btnSubmit.prop('disabled', false);
                } else {
                    btnSubmit.prop('disabled', true);
                }

            }

            function submitRegistration(data) {

                $.ajax({
                    type: 'POST',
                    url: domain + 'register/rest-user/',
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(response) {
                        $('#initialRegistration, #register-intro,  divQn').addClass('d-none');  
                        $('#register-success').delay(520).removeClass('d-none');               
                    },
                    error:function(errResponse) {
                        $('#initialRegistration,  #register-intro, divQn').addClass('d-none');  
                        $('#register-failure').delay(520).removeClass('d-none');                          
                    }
                });

            }            

            $(function () {

                $('#terms-register').change(function(){
                    var response = grecaptcha.getResponse();
                    if(this.checked && response.length > 0) {
                        recaptchaCallback();
                    } else {
                        $('#register').prop('disabled', true);
                    }
                });

                var $sections = $('.form-section');

                function navigateTo(index) {
                // Mark the current section with the class 'current'
                    $sections
                    .removeClass('current')
                    .eq(index)
                    .addClass('current');
                // Show only the navigation buttons that make sense for the current section:
                    $('.form-navigation .previous').toggle(index > 0);
                    var atTheEnd = index >= $sections.length - 1; //return boolen value
                    $('.form-navigation .next').toggle(!atTheEnd);
                    $('.form-navigation [type=submit]').toggle(atTheEnd);
                }

                function curIndex() {
                    // Return the current index by looking at which section has the class 'current'
                    return $sections.index($sections.filter('.current'));
                }

              // Previous button is easy, just go back
                $('.form-navigation .previous').click(function() {
                    navigateTo(curIndex() - 1);
                });

              // Next button goes forward iff current block validates
                $('.form-navigation .next').click(function() {
                    $('.form').parsley().whenValidate({
                        group: 'block-' + curIndex()
                    }).done(function() {
                        navigateTo(curIndex() + 1);
                    });
                });

              // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
                $sections.each(function(index, section) {
                    $(section).find(':input').attr('data-parsley-group', 'block-' + index);
                });
                navigateTo(0); // Start at the beginning
            

                window.Parsley.addValidator('validateName', {
                    validateString: function(value) {
                        if(!value.match('^[a-zA-z0-9\' -]*$')) {
                            return false;
                        }
                    },
                    messages: {
                        en: 'Only letters, numbers, \', - and spaces are valid charcters in this field.',
                    }
                });

                window.Parsley.addValidator('validateAddress', {
                    validateString: function(value) {
                        if(!value.match('^[a-zA-z0-9\.\(\), -]*$')) {
                            return false;
                        }
                    },
                    messages: {
                        en: 'Only letters, numbers, commas, ., -, () and spaces are valid charcters in this field.',
                    }
                });
            
                window.Parsley.addValidator('validateCompanyName', {
                    validateString: function(value) {
                        if(!value.match('^[a-zA-z0-9\'\+\.\(\), -]*$')) {
                            return false;
                        }
                    },
                    messages: {
                        en: 'Only letters, numbers, commas, \' , -, () and spaces are valid charcters in this field.',
                    }
                });

                window.Parsley.addValidator('validateEmail', {

                    validateString: function(value){

                        var valueTrim = value.trim()

                        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

                        if(!valueTrim.match(reg)) {
                            return false;
                        } 
                    },
                        messages: {
                           en: 'Please enter a valid email address.'
                        }
                });

                window.Parsley.addValidator('validatePhone', {
                    validateString: function(value) {
                       if(!value.match('^[0-9\-\+\(\) ]*$')) {
                          return false;
                       }
                    },
                    messages: {
                        en: 'Please enter a valid phone number.',
                    }
                });

                window.Parsley.addValidator('validateZip', {
                    validateString: function(value) {
                       if(!value.match('^[0-9\-]*$')) {
                          return false;
                       }
                    },
                    messages: {
                        en: 'Only numbers and - are valid characters in this field.',
                    }
                });                 

                window.Parsley.addValidator('validateAlpha', {
                    validateString: function(value) {
                       if(!value.match('^[a-zA-Z]+]*$')) {
                          return false;
                       }
                    },
                    messages: {
                        en: 'Only letters are valid charcters in this field.',
                    }
                }); 

            });

            $(window).on('load',function() {
                $('.hide-before').fadeIn(300);
            });

            $(document).ready(function(){

                $('#companyCodeForm').parsley();

                $('#supportLink').attr('href', 'http://thepatent.place/contact/');

                var password_li = $('#passwordStrength').find('li');

                $('#password').bind('keyup', function() {
                    var counter = 0;
                    var pw = $(this).val();
                    console.log(pw)
                    if (pw.length >= 8) {
                      counter++;
                    }

                    if (pw.match(/\d/)) { //match digit
                      counter++;
                    }

                    if (pw.match(/[A-Z]/) && pw.match(/[a-z]/)) { //match digit
                      counter++;
                    }

                    if (pw.match(/[$@$!%*#?&]/)) { //match digit
                      counter++;
                    }

                    //Get all classes to remove
                    var clssesToRemove = password_li.map(function() { //remove data-matched-class attribute depending on counter value
                        console.log(this)
                        return $(this).data('matched-class'); //return any li item with data-matched-class attribute
                    }).get().join(' ');
                    console.log(clssesToRemove)
                    //Remove all class
                    password_li.removeClass(clssesToRemove);

                    //Filter and add class
                    password_li.filter(':lt(' + counter + ')').each(function() { //Select all elements at an index less than index within the matched set. So add class of matched class to all li elements with index less than counter
                        $(this).addClass($(this).data('matched-class')); //used in conjuction with data- attribute
                    });
                
                    //validate confirm password

                    $('#confirm_password').on('blur', function(){
                        if($(this).val() !== $('#password').val()) {
                            $('#valid_confirm_password').html('<span class="font-body m-t-xs valid-container">The passwords do not match.</span>');
                        } else {
                            $('#valid_confirm_password').text('');
                        }
                    });
                });
            }); 
        
            $(document).ready(function(){

                var registerForm = $('#registerForm');
                var timezoneSelect = $('#timezone');
                var business = $('#subBusiness input');
                var sameBusiness = $('#same_as_business');
                        // .prop('checked')

                function updateBusiness() {

                    var addObj = {};

                    for(var i = 0;i < business.length; i++) {

                        switch(business[i].id) {
                            case 'street':
                                addObj.street = business[i].value;
                            break;
                            case 'city':
                                addObj.city = business[i].value;
                            break;
                            case 'USstate':
                                addObj.USstate = business[i].value;
                            break;
                            case 'zip':
                                addObj.zip = business[i].value;
                            break;                                                                      
                        }
                    }

                    $('#pasteBusiness input[id=billing_street').val(addObj.street);
                    $('#pasteBusiness input[id=billing_city').val(addObj.city);
                    $('#pasteBusiness input[id=billing_state').val(addObj.USstate);
                    $('#pasteBusiness input[id=billing_zip').val(addObj.zip);      

                }

                business.on('input', function(e){
                    if(sameBusiness.prop('checked')) {
                        updateBusiness();
                    }
                    
                })

                sameBusiness.change(function(){
                    if(this.checked) {
                        updateBusiness();
                    } else {
                        $('#pasteBusiness input').val('');
                    }
                });

                $('input[name=typeRegister]').change(function(e){
                    if(e.target.id == 'subRegister') {
                        $('#divQn').addClass('d-none')
                        $('#initialRegistration').addClass('d-none')
                        $('#initialRegistrationSubmit').addClass('d-none')

                        $('#subRegistrationSubmit').removeClass('d-none');
                        $('#companyCode').removeClass('d-none');

                        if(registerForm) {
                            registerForm.attr('id', 'subUserForm').attr('id', 'subUserForm');
                        }

                    } else {
                        $('#divQn').addClass('d-none')
                        $('#initialRegistration').removeClass('d-none');
                        $('#initialRegistrationSubmit').removeClass('d-none');
                        $('#subRegistrationSubmit').addClass('d-none');
                        $('#companyCode').addClass('d-none')
                        $('#businessConfirm').addClass('d-none')                  

                        if(registerForm) {
                            registerForm.attr('id', 'registerForm');
                        }

                    }
                });

                $(document).on('submit', '#registerForm', function(e){

                    e.preventDefault();
                    
                    var dataString = $('#registerForm').serializeArray();
                    var gvalue = $('[name="g-recaptcha-response"]').val();

                    dataString.push({
                        'name': 'g-recaptcha-response',
                        'value': gvalue
                    })

                    $.ajax({
                        type: 'POST',
                        url: domain + 'prelogin/rest-verify-recaptcha/',
                        data: dataString,
                        success: function(response) {
                            submitRegistration(dataString)
                        },
                        error:function(errResponse) {
                            console.log('error', errResponse)
                            grecaptcha.reset();
                            $('#recaptchaError').prop('hidden', false);
                        }
                    });                
                });

                $(document).on('submit', '#subUserForm', function(e){
                    e.preventDefault();
                    var dataString = JSON.stringify($('#subUserForm').serializeArray());
                    $.ajax({
                        type: 'POST',
                        url: domain + 'register/rest-subsequent-user-step2/',
                        data: dataString,
                        contentType: "application/json",
                        success: function(response) {
                            $('#initialRegistration, divQn, register-intro').addClass('d-none'); 
                            $('#register-success').delay(520).removeClass('d-none'); 
                        },
                        error:function(errResponse) {

                            $('#registerForm')[0].reset();
                            $('#companyCodeForm')[0].reset();
                            $('#initialRegistration, divQn, register-intro').addClass('d-none');  

                            $('#register-failure').delay(520).removeClass('d-none');                     
                        }
                    });
                });

                $.ajax({
                    type: 'GET',
                    url: '/p3sweb/public/ustimezones.json',
                    dataType: 'json',
                    async: false,
                    success: function(response) {

                        response.ustimezones.forEach(function(data){
                            timezoneSelect.append('<option value="'+data.abbr +'">'+data.abbr +'</option>')
                        })

                    },
                    error: function() {

                    }
                })

                $('#companyCodeForm').submit(function(e){
                    e.preventDefault();

                    var dataString = $('#companyCodeForm').serializeArray();
                    $.ajax({
                        type: 'POST',
                        //url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step1/'+dataString,
                        url: domain + 'register/rest-subsequent-user-step1/',
                        data: dataString,
                        dataType: 'json',
                        success: function(response) {

                            $('#businessValidation').hide();
                            var patentFound = true;
                            if(patentFound) {
                                $('#companyCodeSubmit').attr('disabled', true);
                                $('#companyCodeSubmit').parent().closest('div.form-group').hide();
                            }
                            $('#businessConfirm').removeClass('d-none');
                            $('#businessNameConfirm').html(response.businessName);
                            $('#businessAddressStreetConfirm').html(response.street);
                            $('#businessAddressCityConfirm').html(response.city);
                            $('#businessAddressStateConfirm').html(response.usstate);
                            $('#businessAddressZipConfirm').html(response.zip);                             
                            $('input[id=businessName]').val(response.businessName);
                            $('input[id=phoneNumber]').val(response.phoneNumber);
                            $('#subBusiness input[id=street]').val(response.street);
                            $('#subBusiness input[id=city]').val(response.city);
                            $('#subBusiness input[id=USstate]').val(response.usstate);
                            $('#subBusiness input[id=zip]').val(response.zip);
                            $('#subBusiness select[id=timezone]').append('<option value="'+response.timezone +'">'+response.timezone +'</option>');
                            $('#pasteBusiness input[id=billing_street]').val(response.billingStreet);
                            $('#pasteBusiness input[id=billing_city]').val(response.billingCity);
                            $('#pasteBusiness input[id=billing_state]').val(response.billingState);
                            $('#pasteBusiness input[id=billing_zip]').val(response.billingZip);
                            $('#sameAsBusiness').hide();

                            setTimeout(function() {
                                $('#timezone').val(response.timezone);
                            }, 300);

                        },
                        error: function(errResponse) {
                            if(errResponse.status == 400) {
                                $('#businessValidation').html('<p class="font-body txt-phase-red">The company PIN and number do not match our records. Please try again.</p>');
                            }
                        }
                    });
                });

                $('#businessConfirmSubmit').click(function(e){
                    e.preventDefault();
                    $('#businessConfirm, #subRegistration, #companyCode, #divQn').addClass('d-none');
                    $('#initialRegistration').removeClass('d-none');
                    $('#businessDetails input').each(function(i){
                        $(this).prop('readonly', true);
                    })
                    $('#pasteBusiness input').each(function(i){
                        $(this).prop('readonly', true);
                    })                  
                    $('#businessDetails select').prop('disabled', true);            

                })

                $('#businessCancel').click(function(e){
                    e.preventDefault();
                    window.location.replace(domain+'login');
                });
            });

        </script>
   </body>
</html>
