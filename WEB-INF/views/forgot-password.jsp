<!doctype html>
<html lang="en">

   <head>

      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <base href="/p3sweb/">
      <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

      <link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
      <link rel="stylesheet" type="text/css" href="assets/css/style.css">

      <script src="https://www.google.com/recaptcha/api.js" async defer></script>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/parsley.js/2.8.0/parsley.min.js"></script>

      <title>Patent Place</title>

   </head>

   <body class="bg-light-grey">
      <div class="container-pre-app d-flex justify-content-center align-items-center">
         <div class="container-pre-app__center-box-40 p-a-sm">
            <div class="row m-b-sm">
               <div class="col-md-12 d-flex justify-content-center align-items-center flex-column">
                  <div class="m-b-sm">
                     <img src="assets/imgs/logos/PP_icon_lg.png" alt="patent place logo">
                  </div>
                  <h1 class="font-weight-bold font-h1">Forgot Password</h1>
               </div>
            </div>
            <div id="initialForgotPass">
               <div class="row m-b-sm">
                  <div class="col-md-12 col-lg-12 col-xl-12 text-center">
                     <p class="font-body font-weight-medium">Please enter the email address you used to regisiter this user.</p>
                  </div>
               </div>
               <div id="forgotPassFail" class="hide-before m-b-sm">
                  <div class="content-panel bg-white">
                     <div class="content-panel__body">
                        <div class="row">
                           <div class="col-md-12">
                              <div class="d-flex flex-column justify-content-center align-items-center">
                                 <h3 class="font-h3 font-weight-medium m-b-sm txt-phase-red w-100 text-center">Unsuccessful</h3>
                                 <p id="errorMsg" class="font-body text-center m-b-sm w-100 text-center"></p>
                                 <p class="font-body w-100 text-center">We've encoutered a problem whilst attempting to retrieve your email.  Please try again.  If it's still a problem then please let us know support@ip.place</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <form name="forgotPassForm" id="forgotPassForm" class="form" data-parsley-validate="">                                     
                  <div class="row m-b-sm">
                     <div class="col-md-12">
                        <input name="emailAddress" class="form-control pill-radius font-body m-b-xs" id="emailAddress" placeholder="Email" data-parsley-validate-email="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-trigger="change" data-parsley-required="true">
                     </div>
                  </div>
                  <div class="row m-b-sm">
                      <div class="col-md-12 col-lg-12 col-xl-12">
                          <div class="g-recaptcha d-flex justify-content-center" data-sitekey="6LezdHEUAAAAABvniybP4wWGWWztRMQXT5r0_WMs" data-callback="recaptchaCallback"></div>
                      </div>
                  </div>
                  <div class="row m-b-sm">
                      <div class="col-md-12 col-lg-12 col-xl-12"> 
                        <div class="btn-default">
                           <input type="Submit" id="btnSubmit" value="Reset Password" class="btn btn-block pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer" disabled="disabled">
                        </div>
                     </div>
                  </div>
                  <div class="row m-b-sm">
                     <div class="col-md-12 text-center">
                        <a href="/p3sweb/login" class="font-body text-center txt-black inline-link">Go to login</a>
                     </div>
                  </div>
               </form>
            </div>
            <div id="forgotPassSuccess" class="hide-before">
               <div class="content-panel bg-white">
                  <div class="content-panel__body">
                     <div class="row">
                        <div class="col-md-12">
                           <div class="d-flex flex-column justify-content-center align-items-center">
                              <h3 class="font-h3 font-weight-medium m-b-sm txt-phase-green w-100 text-center">Successful</h3>
                              <p class="font-body text-center w-100">Please check your inbox and complete the process to reset your password.</p>
                           </div>
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

         function recaptchaCallback() {

            var btnSubmit = $('#btnSubmit');

            var response = grecaptcha.getResponse();

            if(response.length > 0) {
               btnSubmit.prop('disabled', false);
            } else {
               btnSubmit.prop('disabled', true);
            }

         }

         function submitRegistration(data) {

            $.ajax({
               type: 'POST',
               url: domain + 'prelogin/rest-forgot-password/',
               data: data,
               success: function(response) {
                  console.log(response)
                  $('#initialForgotPass').fadeOut(500);
                  $('#forgotPassSuccess').delay(520).fadeIn(500);
               },
               error:function(errResponse) {
                  $('#supportLink').attr('href', 'http://thepatent.place/contact/');
                  $('#forgotPassFail').delay(520).fadeIn(500);
                  if(errResponse.status == 403){
                     $('#forgotPassFail p#errorMsg').html('We were unable to send an email to reset your password. Please complete the Registration process before Reset password.');
                  } else if(errResponse.status == 400) {
                     $('#forgotPassFail p#errorMsg').html('We were unable to find the email address in our records. Please check and try again.');
                  } else{
                     $('#forgotPassFail p#errorMsg').html('There is currently an issue with our server and are unable to send an email to reset your password. Sorry for any inconvenience. Please try again later.');                     
                  }
               }
            });

         }

         $(function () {

            $('#forgotPassSuccess').hide();
            $('#forgotPassFail').hide();
            $('#fail_user_disabled').hide();

            window.Parsley.addValidator('validateEmail', {

               validateString: function(value){

                  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

                  if(!value.match(reg)) {
                    return false;
                  }

               },
               messages: {
                  en: 'Please enter a valid email address.'
               }
            });

            $(document).on('submit', '#forgotPassForm', function(e){
               e.preventDefault();
               var dataString = $('#forgotPassForm').serializeArray();
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
         });

      </script>
   </body>
</html>