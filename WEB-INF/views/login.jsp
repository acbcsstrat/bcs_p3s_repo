<!doctype html>
<html lang="en">

   <head>

      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <base href="/p3sweb/">

      <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

      <link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
      <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css">
      <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

      <link rel="stylesheet" type="text/css" href="dist/main.css">

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/parsley.js/2.8.0/parsley.min.js"></script>      

      <title>Patent Place</title>

      <style id="antiClickjack">body{display:none !important;}</style>

      <script type="text/javascript">

         if(self === top) {
            var antiClickjack = document.getElementById("antiClickjack");
            antiClickjack.parentNode.removeChild(antiClickjack);
         } else {
            top.location = self.location;
         }

      </script>

   </head>

   <body class="bg-light-grey2">
      <div class="d-flex justify-content-center align-items-center content-panel">
         <div class="container-pre-app__center-box-40">
            <img src="assets/imgs/logos/pp-logo-text.png">
            <div class="content-panel__body bg-white">
               <div class="row m-b-sm">
                  <div class="col-md-12 d-flex justify-content-between align-items-center">
                     <h1 class="font-weight-bold font-h2">Login</h1>
                     <div class="d-flex">                     
                        <p class="font-body font-weight-medium m-r-xs">Don't have an account?</p>
                        <a href="/p3sweb/register" class="inline-link">Register</a>
                     </div>
                  </div>
               </div>               
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
                              <input type="password" name="j_password" class="form-control font-body pill-radius input-p-sm" placeholder="Password" data-parsley-required-message="Please ensure all fields have been completed." data-parsley-required="true" autocomplete="off">
                           </div>
                        </div>
                        <div class="form-group d-flex justify-content-center flex-column m-b-sm">
                           <p id="loginMessage" class="m-b-sm font-body txt-phase-red"></p>
                           <input type="submit" name="loginBtn" id="loginBtn" value="Login" class="btn btn--lg btn--green pill-radius">
                        </div>
                     </form>
                     <div class="row">
                        <div class="col-md-12 text-center">
                           <a href="/p3sweb/forgot-password" class="btn-no-bg font-weight-medium btn-underlined">Forgot Password?</a>
                        </div>
                     </div>
           <!--           <div class="row"> -->
<!--                         <div class="col-md-12 d-flex justify-content-between align-items-center">
                           <p class="font-body">Don't have an account?</p>
                           <div class="btn-no-bg">
                              <a class="btn btn--lg btn--bordered green txt-black pill-radius" href="/p3sweb/register">Register</a>
                           </div>
                        </div>
                     </div> -->
                  </div>
               </div>
            </div>
         </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

      <script>
         
         var url = window.location.href;

         function loginErrorFn () {
            $('#loginMessage').css('display', 'block');
            $('#loginMessage').html('The username and password do not match our records. Please try again.');
            
         }

         $(function(){

            $('#loginMessage').css('display', 'none');

            if(url.indexOf('login_error') >= 0) {
               loginErrorFn();
            }

         })

         window.Parsley.addValidator('validateName', {
            validateString: function(value) {
               if(!value.match('^[a-zA-z0-9\s\w\'-]*$')) {
                  return false;
               }
            },
            messages: {
                en: 'Only letters, numbers, \', - and spaces are valid charcters in this field.'
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