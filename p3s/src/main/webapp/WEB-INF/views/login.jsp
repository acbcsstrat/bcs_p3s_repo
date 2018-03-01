<!doctype html>
<html lang="en">

   <head>

      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      
      <base href="/p3sweb/">
	  
      <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

      <link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

      <link rel="stylesheet" type="text/css" href="assets/css/style.css">

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/parsley.js/2.8.0/parsley.min.js"></script>      

      <title>Patent Place</title>
      
   </head>

   <body class="bg-light-grey2">
      <div class="container-pre-app d-flex justify-content-center align-items-center">
         <div class="container-pre-app__center-box-40 p-a-sm border">
            <div class="content-panel">
               <div class="text-center">
                  <div class="row">
                     <div class="col-md-12 d-flex justify-content-center align-items-center flex-column">
                        <div class="m-b-md">
                           <img src="assets/imgs/logos/PP_icon_lg.png" alt="patent place logo">
                        </div>
                        
                        <h1 class="font-weight-bold font-h1">Login</h1>
                     </div>
                  </div>
               </div>
               <div class="content-panel__body">
                  <div class="row">
                     <div class="col-md-12">
                        <form id="ppLoginForm" action="resources/j_spring_security_check" method="post" class="form" data-parsley-validate="">
                           <div class="form-group row m-b-sm">
                              <div class="col-md-12">
                                 <input type="text" name="j_username" class="form-control font-body pill-radius input-p-sm" placeholder="Username" data-parsley-validate-email="" data-parsley-required-message="Please ensure all fields have been completed." data-parsley-required="true">
                              </div>
                           </div>
                           <div class="form-group row m-b-sm">
                              <div class="col-md-12">
                                 <input type="password" name="j_password" class="form-control font-body pill-radius input-p-sm" placeholder="Password" data-parsley-required-message="Please ensure all fields have been completed." data-parsley-required="true">
                              </div>
                           </div>
                           <div class="form-group d-flex justify-content-center flex-column m-b-sm">
                              <p id="loginMessage" class="m-b-sm font-body txt-phase-red">The username and password do not match our records. Please try again.</p>
                              <div class="btn-default">
                                 <input type="submit" value="Login" class="btn btn-block pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer">
                              </div>
                           </div>
                        </form>
                        <div class="row m-b-sm">
                           <div class="col-md-12 text-center">
                              <a href="/p3sweb/forgot-password" class="font-body text-center txt-black inline-link">Forgot Password?</a>
                           </div>
                        </div>
                        <div class="row">
                           <div class="col-md-12 d-flex justify-content-between align-items-center">
                              <p class="font-body">Don't have an account?</p>
                              <div class="btn-no-bg">
                                 <a class="btn btn--lg btn-no-bg--green green-notification pill-radius txt-phase-green font-weight-medium font-body" href="/p3sweb/register">Register</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>         
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

      <script>
         
         var url = window.location.href;

         $('#loginMessage').hide();

         function loginErrorFn () {
            $('#loginMessage').show();
         }

         if(url.indexOf('login_error') >= 0) {
            loginErrorFn();
         }

         window.Parsley.addValidator('validateName', {
            validateString: function(value) {
               if(!value.match('^[a-zA-z0-9\s\w\'-]*$')) {
                  return false;
               }
            },
            messages: {
                en: 'Only letters, numbers, \', - and spaces are valid charcters in this field.',
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
         
      </script>
   </body>
</html>