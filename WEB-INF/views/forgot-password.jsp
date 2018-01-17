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

   <body class="bg-light-grey"> 
      	<div class="container-pre-app d-flex justify-content-center align-items-center">
         	<div class="container-pre-app__center-box-40 p-a-sm border">
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
					<form name="forgotPassForm" id="forgotPassForm" class="form" data-parsley-validate="">													
						<div class="row m-b-sm">
							<div class="col-md-12">
								<input name="emailAddress" class="form-control pill-radius font-body" id="emailAddress" placeholder="Email" data-parsley-validate-email="" data-parsley-required-message="Please ensure this field has been completed." data-parsley-trigger="change" data-parsley-required="true">
							</div>
						</div>
						<input type="Submit" value="Reset Password" class="btn btn-block pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer">
					</form>   	          			
          		</div>
				<div id="forgotPassSuccess" class="hide-before">
   					<div class="content-panel">
   						<div class="content-panel__body">
	   						<div class="row">
	   							<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
	   								<h3 class="font-h3 font-weight-medium m-b-sm">Successful!</h3>
	   								<p class="font-body text-center">Please check your inbox and complete the process to reset your password.</p>
	   								<p class="font-body text-center">
	   									{{{{{TEMP :: As no email being send}}}}}<br/>
	   									<a id="clickme" href="">Click here</a> to reset password
	   								</p>
	   							</div>
	   						</div>   							
   						</div>
   					</div>      			
          		</div>
				<div id="forgotPassFail" class="hide-before">
   					<div class="content-panel">
   						<div class="content-panel__body">
	   						<div class="row">
	   							<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
									<h3 class="font-h3 font-weight-medium m-b-sm">Unsuccessful!</h3>
	   								<p class="font-body text-center">We were unable to send an email to reset your password. Please try again later.</p>
	   							</div>
	   						</div>
	   					</div>
   					</div>
          		</div>
          		<div id="fail_user_disabled" class="hide-before">
   					<div class="content-panel">
   						<div class="content-panel__body">
	   						<div class="row">
	   							<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
									<h3 class="font-h3 font-weight-medium m-b-sm">Unsuccessful!</h3>
	   								<p class="font-body text-center">We were unable to send an email to reset your password. Please complete the Registration process before Reset password.</p>
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
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>      	

      	<script>

      		var domain = 'http://localhost:8080/p3sweb/';

          $(function () {

          $('#forgotPassSuccess').hide();
          $('#forgotPassFail').hide();
          $('#fail_user_disabled').hide();

          window.Parsley.addValidator('validateEmail', {

                  validateString: function(value){

                     var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

                     if(!value.match(reg)) {
                        return false
                     }
                  },
                  messages: {
                     en: 'Please enter a valid email address.'
                  }

              })

              $(document).on('submit', '#forgotPassForm', function(e){
                e.preventDefault();
              //var dataString = JSON.stringify($('#forgotPassForm').serializeArray());
              var dataString = $('#forgotPassForm').serializeArray();
              $.ajax({
                type: 'POST',
                url: domain + 'prelogin/rest-forgot-password/',
                data: dataString,
                dataType: 'json',
                success: function(response) {
                	console.log(response);
                  	$('#initialForgotPass').fadeOut(500); 
                	$('#forgotPassSuccess').delay(520).fadeIn(500);   
                	$("a#clickme").attr('href', response.sampleLinkInEmail);
                },
                error:function(errResponse) {
                	console.log(errResponse.status);
                	if(errResponse.status == 403){
	                  	$('#initialForgotPass').fadeOut(500); 
	               	 	$('#fail_user_disabled').delay(520).fadeIn(500); 
                	}
                	else{
                		$('#initialForgotPass').fadeOut(500); 
	               	 	$('#forgotPassFail').delay(520).fadeIn(500); 
                	}
                }
              })
            })

      })

     	</script>


      
   </body>
</html>
