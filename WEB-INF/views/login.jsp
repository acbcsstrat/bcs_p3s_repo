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

      <link rel="stylesheet" type="text/css" href="assets/css/style.css">

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> fe-branch-registration
>>>>>>> fe-branch-registration
      
       <script> 
          
    
       var domain = 'http://localhost:8080/p3sweb/';
       
       $(document).ready(function() {
			$(document).on('submit', '#ppLoginForm', function(e){
 				e.preventDefault();
					//var dataString = JSON.stringify($('#resetPassForm').serializeArray());
					var dataString = $('#ppLoginForm').serializeArray();
					console.log("I am new");
					console.log(dataString);
					$.ajax({
						type: 'POST',
						url: domain + 'resources/j_spring_security_check',
						data: dataString,
						//dataType: 'json',
						success: function(response) {

							$('#initialResetPassForm').fadeOut(500);	
						$('#resetPassSuccess').delay(520).fadeIn(500);		      				
						},
						error:function(errResponse) {
							$('#initialResetPassForm').fadeOut(500);	
						$('#resetPassFail').delay(520).fadeIn(500);							
						}
					});
				});
       });
        </script> 
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> master-merge
>>>>>>> fe-branch-registration
>>>>>>> fe-branch-registration

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
                     <h1 class="font-h1 font-weight-light">Login into your account</h1>

                  </div>
               </div>
               <div class="row">
                  <div class="col-md-12">
<<<<<<< HEAD
                     <form id="ppLoginForm"  class="form" data-parsley-validate="">
=======
<<<<<<< HEAD
                     <form id="ppLoginForm"  class="form" data-parsley-validate="">
=======
<<<<<<< HEAD
                     <form id="ppLoginForm" action="resources/j_spring_security_check" method="post" class="form" data-parsley-validate="">
=======
                     <form id="ppLoginForm"  class="form" data-parsley-validate="">
>>>>>>> master-merge
>>>>>>> fe-branch-registration
>>>>>>> fe-branch-registration
                        <div class="form-group row m-b-sm">
                           <div class="col-md-12">
                              <input type="text" name="j_username" class="form-control font-body pill-radius input-p-sm" placeholder="Username/Email" data-parsley-validate-email="" data-parsley-required-message="Please ensure all fields have been completed." data-parsley-required="true">
                           </div>
                        </div>
                        <div class="form-group row m-b-sm">
                           <div class="col-md-12">
                              <input type="password" name="j_password" class="form-control font-body pill-radius input-p-sm" placeholder="Password" data-parsley-required-message="Please ensure all fields have been completed." data-parsley-required="true" autocomplete="off">
                           </div>
                        </div>
                        <div class="form-group text-center m-b-md m-t-md">
                           <p id="loginMessage" class="m-b-sm font-body txt-phase-red"></p>
                           <input type="submit" name="loginBtn" id="loginBtn" value="Login" class="font-h4 btn btn--box-shadow text-uppercase p-r-6 p-l-6 py-2 btn--green pill-radius">
                        </div>
                     </form>
                     <div class="row">
                        <div class="col-md-12 text-center d-flex justify-content-between m-t-sm">
                           <div class="d-flex">                     
                              <p class="font-body m-r-xs">Don't have an account?</p>
                              <a href="/p3sweb/register" class="inline-link font-weight-bold font-weight-medium txt-phase-green">Register Now</a>
                           </div>                           
                           <a href="/p3sweb/forgot-password" class="btn-no-bg font-weight-medium btn-underlined">Forgot Password?</a>
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