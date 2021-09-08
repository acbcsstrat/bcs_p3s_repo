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
                antiClickjack.parentNode.removeChild(antiClickjack)
            } else {
                top.location = self.location
            }

        </script>      

   	</head>

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
                     <h1 class="font-h1 font-weight-light">Create new password</h1>

                  </div>
               </div>
          		<div id="initialResetPassForm">
					<form name="resetPassForm" id="resetPassForm" class="form" data-parsley-validate="">													
						<div class="form-group row">
							<div class="col-md-12">
								<input type="password" name="password" class="form-control pill-radius font-body" id="password" placeholder="Enter your new password" data-parsley-length="[8, 20]" data-parsley-length-message="Your password needs to be between 8 and 20 characters long." data-parsley-trigger="change" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true" autocomplete="off">
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12">
								<ul id="passwordStrength" class="p-none m-none">
									<li class="point"></li>
									<li class="point"></li>
									<li class="point"></li>
									<li class="point"></li>
								</ul>															
							</div>
						</div>														
						<div class="form-group row m-b-md">
							<div class="col-md-12">
								<input type="password" class="form-control pill-radius font-body" id="confirm_password" placeholder="Confirm your new password" data-parsley-equalto-message="Your passwords don't match.  Please re-enter." data-parsley-equalto="#password" data-parsley-trigger="change" data-parsley-required-message="Please ensure this field has been completed." data-parsley-required="true" autocomplete="off">
							</div>
						</div>
						<div class="text-center">
							<input type="Submit" value="Reset Password" class="btn btn--lg btn--green pill-radius p-r-6 p-l-6">
						</div>
						
					</form>   	          			
          		</div>
				<div id="resetPassSuccess" class="hide-before text-center">
					<div class="row">
						<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
							<h3 class="font-h3 font-weight-medium m-b-sm">Successful</h3>
							<p class="font-body text-center">You have successfully reset your password.</p>
						</div>
					</div>
					<a class="btn btn-block btn--lg btn--green pill-radius m-t-sm" href="/p3sweb/login">Go to Login</a>
          		</div>
				<div id="resetPassFail" class="hide-before">
					<div class="row">
						<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
							<h3 class="font-h3 font-weight-medium m-b-sm">Unsuccessful</h3>
							<p class="font-body text-center">We've encoutered a problem whilst attempting to reset your password.  Please try again.  If it's still a problem then please let us know support@ip.place</p>
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

			$(document).ready(function() {
				$(document).on('submit', '#resetPassForm', function(e){
      				e.preventDefault();
  					//var dataString = JSON.stringify($('#resetPassForm').serializeArray());
  					var dataString = $('#resetPassForm').serializeArray();
  					console.log(dataString);
  					$.ajax({
  						type: 'POST',
  						url: domain + 'prelogin/rest-reset-password/',
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

				var password_li = $('#passwordStrength').find('li');
				$('#password').bind('keyup', function(){

					if($(this).val().length === 0) {
						password_li.css('background', '#DDD');
						return;
					}
					
					var regex = [];

			        regex.push("[A-Z]"); //Uppercase Alphabet.
			        regex.push("[a-z]"); //Lowercase Alphabet.
			        regex.push("[0-9]"); //Digit.
			        regex.push("[$@$!%*#?&]"); //Special Character.

			        var passed = 0;

			        //Validate for each Regular Expression.
			        for (var i = 0; i < regex.length; i++) {
			            if (new RegExp(regex[i]).test($(this).val())) {
			                passed++;
			            }
			        }

			        //Validate for length of Password.
			        if (passed > 2 && $(this).val().length > 8) {
			            passed++;
			        }

					switch(passed) {
						case 0:
						break;
						case 1:
							$(password_li[0]).css('background', '#e30613'); //red
							$(password_li[1]).css('background', '#dcdcdc'); 							
						break;
						case 2:
							$(password_li[1]).css('background', '#f9b233'); //amber
							$(password_li[2]).css('background', '#dcdcdc'); 													
						break;
						case 3:
							$(password_li[2]).css('background', '#53ab58'); //green
							$(password_li[3]).css('background', '#dcdcdc'); 							
						break;
						case 4:
							$(password_li[3]).css('background', '#53ab58');
						break;
						case 5:
							$(password_li[3]).css('background', '#418746');						

					}
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

     	</script>
   </body>
</html>