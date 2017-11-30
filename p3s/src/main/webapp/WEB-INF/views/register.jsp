
<!doctype html>
<html lang="en">

   <head>

  		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  		<link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700" rel="stylesheet">

  		<link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
  		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  		<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

	  	<link rel="stylesheet" type="text/css" href="assets/css/style.css">

      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/parsley.js/2.8.0/parsley.min.js"></script>

      <title>Patent Place</title>

   	</head>

   	<body class="bg-light-grey hide-before"> 
      	<div class="container-pre-app d-flex justify-content-center align-items-center">
         	<div class="container-pre-app__center-box-40 p-a-sm border">
          		<div class="row m-b-sm">
                     <div class="col-md-12 d-flex justify-content-center align-items-center flex-column">
                        <div class="m-b-sm">
                           <img src="assets/imgs/logos/PP_icon_lg.png">
                        </div>
                        <h1 class="font-weight-bold font-h1">Register</h1>
                     </div>
          		</div>
         <!--   		<div class="d-flex align-items-center flex-column"> -->
         		<div id="register-intro">
	       			<div class="row m-b-sm">
	       				<div class="col-md-12 col-lg-12 col-xl-12 text-center">
	       					<a href="/p3sweb/login" class="font-body txt-phase-green font-weight-medium">Already have user account set up?</a>
	       				</div>
	       			</div>
	       			<div class="row m-b-md" id="divQn">
	       				<div class="col-md-12 col-lg-12 col-xl-12 text-center">
	       					<span class="font-body font-weight-medium m-r-md">Firm already registered?</span>
	                    	<label class="form-check-label font-body m-r-sm">Yes<input class="m-l-xs" type="radio" name="typeRegister" id="subRegister"></label>
	                    	<label class="form-check-label font-body">No<input class="m-l-xs" type="radio" name="typeRegister" id="initalRegister"></label>
	       				</div>
	       			</div>         			
         		</div>

       			<div id="initialRegistration">
       				<div class="row">
              			<div class="col-xl-8 offset-xl-2">
              				<form name="register" id="registerForm" class="form" data-parsley-validate="">													
								<div class="form-section m-b-sm">
									<div class="form-group row">
										<div class="col-md-12">
											<input name="emailAddress" class="form-control pill-radius font-body" id="emailAddress" placeholder="Email"  ata-parsley-type="email" data-parsley-required="true">
										</div>
									
									</div>
									<div class="form-group row">
										<div class="col-md-12">
											<input type="text" name="firstName" class="form-control pill-radius font-body" id="firstName" placeholder="First Name" data-parsley-pattern="/^[\w\s-'']*$/" data-parsley-required="true">
										</div>
									</div>
									<div class="form-group row">
										<div class="col-md-12">
											<input type="text" class="form-control pill-radius font-body" name="lastName"  id="lastName" placeholder="Last Name" data-parsley-pattern="/^[\w\s-'']*$/" data-parsley-required="true">
										</div>
									</div>
									<div class="form-group row">
										<div class="col-md-12">
											<input type="password" name="password" class="form-control pill-radius font-body" id="password" placeholder="Password" data-parsley-length="[8, 20]" data-parsley-required="true">
										</div>
									</div>
									<div class="form-group row">
										<div class="col-md-12">
											<ul id="passwordStrength" class="p-none m-none">
												<li class="point-reg"></li>
												<li class="point-reg"></li>
												<li class="point-reg"></li>
												<li class="point-reg"></li>
											</ul>															
										</div>
									</div>														
									<div class="form-group row m-b-none">
										<div class="col-md-12">
											<input type="password" name="confirm_password" class="form-control pill-radius font-body" id="confirm_password" placeholder="Confirm Password" data-parsley-equalto="#password" data-parsley-required="true">
										</div>
									</div>
								</div>										  			
								<div class="form-section m-b-md">
									<div class="form-group row">
										<div class="col-md-12">
											<input type="text" name="businessName" class="form-control pill-radius font-body" id="businessName" placeholder="Business Name" data-parsley-pattern="/^[0-9a-zA-Z\w\s-'+()]*$/" data-parsley-required="true">
											
										</div>
									</div>
									<div class="form-group row">
										<div class="col-md-12">
											<input input="text" name="phoneNumber" class="form-control pill-radius font-body" id="phoneNumber" placeholder="Tel" data-parsley-maxlength="40" data-parsley-pattern="^[0-9\d\+\(\)\w\s]*$" data-parsley-required="true">		
										</div>
									</div>
									<div id="subBusiness">
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="street" class="form-control pill-radius font-body" id="street" placeholder="Street" data-parsley-pattern="/^[0-9a-zA-z\w\s.-_,()]*$/" data-parsley-required="true">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="city" class="form-control pill-radius font-body" id="city" placeholder="City" data-parsley-required="true" data-parsley-pattern="/^[a-zA-z0-9\w\s.-_,()]*$/">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="USstate" class="form-control pill-radius font-body" id="USstate" placeholder="State" data-parsley-required="true" data-parsley-pattern="/^[\w\s.-_,()]*$/">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-6">
												<input type="text" class="form-control pill-radius font-body" id="zip" placeholder="Zip"  data-parsley-pattern="/^[0-9-]+$/" data-parsley-required="true">
											</div>
											<div class="col-md-6">
												<select class="form-control pill-radius font-body form-control" name="timezone" id="timezone" data-parsley-required="true">
													<option value="" selected disabled hidden class="txt-grey">Time Zone</option>
													<option value="et" class="form-control">ET</option>
													<option value="ct" class="form-control">CT</option>
													<option value="mt" class="form-control">MT</option>
													<option value="pt" class="form-control">PT</option>
													<option value="akt" class="form-control">AKT</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="form-section">
									<div class="row m-b-md">
										<div class="col-md-12">
											<div class="row m-t-xs">
												<div class="col-md-12">
													<div class="onoffswitch d-flex align-items-center justify-content-between">
														<span class="font-body font-weight-medium m-r-sm">Same as billing address?</span>
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
											<div class="col-md-12">
												<input type="text" name="billingStreet" class="form-control pill-radius font-body" id="billing_street" placeholder="Street" data-parsley-pattern="/^[\w\s.-_,()]*$/" data-parsley-required="true">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="billingCity" class="form-control pill-radius font-body" id="billing_city" placeholder="City" data-parsley-pattern="/^[\w\s.-_,()]*$/" data-parsley-required="true">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="billingState" class="form-control pill-radius font-body" id="billing_state" placeholder="State" data-parsley-pattern="/^[\w\s.-_,()]*$/" data-parsley-required="true">
											</div>
										</div>
										<div class="form-group row">
											<div class="col-md-12">
												<input type="text" name="billingZip" class="form-control pill-radius font-body" id="billing_zip" placeholder="Zip" data-parsley-pattern="/^[0-9-]+$/" data-parsley-required="true" >
											</div>
										</div>
									</div>
									<div class="row m-b-sm">
				                        <label class="form-check-label font-body col-md-12 text-center">
			                            	I accept the <span class="font-weight-bold m-r-xs">Terms and Conditions</span> 
			                            	<input type="checkbox" name="terms-register" id="terms-register" data-parsley-required="true">
			                       	 	</label>									
									</div>
									<!-- <div class="row">
										<div class="col-md-12 d-flex justify-content-between btn-default">
							  				<button type="button" class="btn btn--lg pill-radius bg-phase-green font-body font-body--component txt-white font-weight-medium cursor-pointer" id="prevBusinessForm">Prev Step</button>
					                        <button class="btn btn--lg bg-phase-green pill-radius txt-white font-body font-body--component font-weight-medium" type="submit" id="register" disabled>Register</button>						                        			
										</div>
									</div> -->
								</div>
							  	<div class="row">
							  		<div class="col-md-12">
								  	  	<div class="form-navigation d-flex justify-content-between btn-default">
									    	<button type="button" class="previous btn btn--lg pill-radius bg-phase-green font-body font-body--component txt-white font-weight-medium cursor-pointer">Previous</button>
									    	<button type="button" class="next btn btn--lg pill-radius bg-phase-green font-body font-body--component txt-white font-weight-medium cursor-pointer">Next</button>
									    	<input type="submit" value="Register" id="register" class="btn btn--lg bg-phase-green pill-radius txt-white font-body font-body--component font-weight-medium cursor-pointer">
									  	</div>								  			
							  		</div>
							  	</div>
							</form>
              			</div>
              		</div>
       			</div>

           		<div id="register-success">
   					<div class="content-panel bg-white">
   						<div class="content-panel__body">
	   						<div class="row">
	   							<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
	   								<h3 class="font-h4 txt-phase-green m-b-sm">Successful!</h3>
	   								<p class="font-body text-center">You have successfully reigstered your details. Please check your inbox to validate your account</p>
	   							</div>
	   						</div>   							
   						</div>
   					</div>
   				</div>

   				<div id="register-failure">
   					<div class="content-panel bg-white">
   						<div class="content-panel__body">
	   						<div class="row">
	   							<div class="col-md-12 d-flex flex-column justify-content-center align-items-center">
									<h3 class="font-h4 txt-phase-red  m-b-sm">Unsuccessful!</h3>
	   								<p class="font-body text-center">You have successfully reigstered your details. Please check your inbox to validate your account</p>
	   							</div>
	   						</div>
	   					</div>
   					</div>
   				</div>	   	

       			<div id="companyCode">
       				<div class="row">
       					<div class="col-md-12 d-flex justify-content-center flex-column align-items-center">
       						<div class="container-pre-app__center-box-70">
           						<form name="companyCodeForm" id="companyCodeForm">
           							<div class="m-b-md">
	           							<div class="form-group row">
	           								<div class="col-md-12">
	           									<input  class="form-control pill-radius font-body" name="businessNumber" placeholder="Business Number" data-parsley-maxlength="6" data-parsley-type="alphanum" data-parsley-required="true">
	           								</div>
	           							</div>
	           							<div class="form-group row">
	           								<div class="col-md-12">
	           									<input class="form-control pill-radius font-body" name="businessPin" placeholder="Business PIN" data-parsley-minlength="6" data-parsley-type="digits" data-parsley-required="true">
	           								</div>
	           							</div>            								
           							</div>
           							<div class="form-group row">
           								<div class="col-md-7 offset-md-5 btn-default">
           									<input type="submit" name="companyCodeSubmit" id="companyCodeSubmit" class="btn btn--lg btn-block bg-phase-green pill-radius txt-white font-body font-weight-medium p-wide-sm cursor-pointer" value="Search">
           								</div>
           							</div>
           						</form>
           					</div>
       					</div>
       				</div>
       			</div>
   				<div id="businessConfirm">
   					<div class="row">
       					<div class="col-md-12">
       						<div class="m-b-xs text-center">
       							<p class="font-h4 font-weight-medium">Details Found</p>
       						</div>
       						<div class="m-b-sm">
   								<table class="t-data font-body t-border-space">
           							<tr>
           								<td class="font-weight-medium">Business Name: </td>
           								<td  class="bg-white" id="businessNameConfirm"></td>
           							</tr>
           							<tr>
           								<td class="font-weight-medium">Business Address: </td>
           								<td class="bg-white">
           									<span id="businessAddressStreetConfirm"></span><br>
           									<span id="businessAddressCityConfirm"></span><br>
           									<span id="businessAddressStateConfirm"></span><br>
           									<span id="businessAddressZipConfirm"></span>
           								</td>
           							</tr>               							
           						</table>           							
       						</div>
       						<div class="row">
   								<div class="col-md-12 d-flex justify-content-between align-items-center">
   									<p class="font-weight-medium font-body m-r-sm">Above details correct?</p>
   									<div class="d-flex">
	   									<div class="btn-submit m-r-sm">
	       									<input type="submit" id="businessConfirmSubmit" name="businessConfirmSubmit" class="btn btn--check bg-phase-green pill-radius txt-white font-body font-body--component font-weight-medium btn--lg m-r-xs cursor-pointer" value="Yes">
	   									</div>
	   									<div class="btn-error">      									
	       									<input type="submit" id="businessConfirmSubmit" name="businessConfirmSubmit" class="btn btn--cross bg-phase-red pill-radius txt-white font-body font-body--component font-weight-medium btn--lg cursor-pointer" value="No">       										
	   									</div>   										
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
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>      	

      	<script>

      		var domain = 'http://localhost:8080/p3sweb/';

			$(function () {
			  	var $sections = $('.form-section');

			  	function navigateTo(index) {
			    // Mark the current section with the class 'current'
			    	$sections
			      	.removeClass('current')
			      	.eq(index)
			        .addClass('current');
			    // Show only the navigation buttons that make sense for the current section:
				    $('.form-navigation .previous').toggle(index > 0);
				    var atTheEnd = index >= $sections.length - 1;
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
			});


			window.Parsley.addValidator('alpha', {
				validateString: function(value) {
					if(!value.match('[/[a-zA-Z]+/]')) {
						return value;
					}
				},
			 	messages: {
				    en: 'Invalid input',
			  	}
			})

			$('#register-success').hide();
			$('#register-failure').hide();
      		$('#initialRegistration').hide();
      		$('#companyCode').hide();
      		$('#businessConfirm').hide();

      		$(window).on('load',function() {
			 	$('.hide-before').fadeIn(500);
			});

			$(document).ready(function(){
				$('#companyCodeForm').parsley()
			})

			$(document).ready(function(){

				var password_li = $('#passwordStrength').find('li');
				$('#password').bind('keyup', function(){

					if($(this).val().length == 0) {
						password_li.css('background', '#DDD');
						return;
					}
					
					var regex = new Array();
			        regex.push("[A-Z]"); //Uppercase Alphabet.
			        regex.push("[a-z]"); //Lowercase Alphabet.
			        regex.push("[0-9]"); //Digit.
			        regex.push("[$@$!%*#?&]"); //Special Character.

			        var passed = 0;

			        //Validate for each Regular Expression.
			        for (var i = 0; i < regex.length; i++) {
			            if (new RegExp(regex[i]).test($(this).val())) {
			            	console.log(regex[i])
			                passed++;
			            }
			        }


			        //Validate for length of Password.
			        if (passed > 2 && $(this).val().length > 8) {
			            passed++;
			        }

					var color = '';
					var strength = '';

					switch(passed) {
						case 0:
						break;
						case 1:
						console.log('red')
							$(password_li[0]).css('background', '#e30613'); //red
							$(password_li[1]).css('background', '#dcdcdc'); 							
						break;
						case 2:
						console.log('amber')
							$(password_li[1]).css('background', '#f9b233'); //amber
							$(password_li[2]).css('background', '#dcdcdc'); 													
						break;
						case 3:
						console.log('green')
							$(password_li[2]).css('background', '#53ab58'); //green
							$(password_li[3]).css('background', '#dcdcdc'); 							
						break;
						case 4:
						console.log('dark green')
							$(password_li[3]).css('background', '#53ab58');
						break;
						case 5:
						console.log('dark green')
							$(password_li[3]).css('background', '#53ab58');						

					}

				})


				//validate confirm password

				$('#confirm_password').on('blur', function(){
					if($(this).val() !== $('#password').val()) {
						$('#valid_confirm_password').html('<span class="font-body m-t-xs valid-container">The passwords do not match.</span>')
					} else {
						$('#valid_confirm_password').text('');
					}
				})
			})
      	
	      	$(document).ready(function(){

	      		$(".nav-tabs a[data-toggle=tab]").on("click", function(e) {
				  	if($(this).hasClass("disabled")) {
				    	e.preventDefault();
			  	  		return false;
				  	}
				});

	      		var tabs = $('registerTabs');
				var userForm = $('#userForm');
				var businessForm = $('#businessForm');
				var prevBusinessForm = $('#prevBusinessForm');
				var billingForm = $('#billingForm');
				var userInput = $('#userSet input');
				var businessInput = $('#businessSet input');
				var billingInput = $('#billingSet input');


				userForm.click(function(e){
					console.log('click')
					e.preventDefault();
					$('#registerTabs a[href*="userDetails"').tab('show');
				})

				prevBusinessForm.click(function(e){
					console.log('click')
					e.preventDefault();
					$('#registerTabs a[href*="businessDetails"').tab('show');
				})

				businessForm.click(function(e){
					console.log('click')
					e.preventDefault();
					$('#registerTabs a[href*="businessDetails"').tab('show');
				})

				billingForm.click(function(e){
					console.log('click')
					e.preventDefault();
					$('#registerTabs a[href*="billingDetails"').tab('show');
				})				

				userInput.on('blur', function() {
					var input = $(this).parent().closest('fieldset').find('input')
					var btn = $('#businessForm');
					checkValidation(input, btn)
				});

				businessInput.on('blur', function() {
					var input = $(this).parent().closest('fieldset').find('input')
					var btn = $('#billingForm');
					checkValidation(input, btn)
				});

				billingInput.on('blur', function() {
					var input = $(this).parent().closest('fieldset').find('input')
					var btn = '';
					var preBtn = $('#businsessForm');
					checkValidation(input, btn)
				});								

				function checkValidation(input, btn) {
  					var valid = false;
	  				input.each(function() {
	  					if($(this).val() == '') {
	  						valid = false;
	  					} else {
	  						valid = true;
	  					}
	  				});
	  				if(valid) {
	  					$(btn).attr('disabled', false);
	  					if(btn) {
		  					if(btn[0].id == 'businessForm') {
		  						$("a[href*='#businessDetails']").removeClass('disabled');
		  					} else {
		  						$("a[href*='#billingDetails']").removeClass('disabled');
		  					}
	  					}
	  				} else {
	  					$(btn).attr('disabled', true)
	  				}
  				}

	      		$('#same_as_business').change(function(){
	      			if(this.checked) {

	      				var addObj = {}
	      				var business = $('#subBusiness input');

	      				for(i=0;i < business.length; i++) {

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

	      				$('#pasteBusiness input[id=billing_street').val(addObj.street)
	      				$('#pasteBusiness input[id=billing_city').val(addObj.city)
	      				$('#pasteBusiness input[id=billing_state').val(addObj.USstate)
	      				$('#pasteBusiness input[id=billing_zip').val(addObj.zip)

	      			} else {
	      				$('#pasteBusiness input').val('')
	      			}
	      		})

	      		$('#terms-register').change(function(){
	      			if(this.checked) {
	      				$('#register').removeAttr('disabled');
	      			} else {
	      				$('#register').prop('disabled', true);
	      			}
	      		})

	      		$('#subRegister').change(function(){
	      			if(this.checked) {
	      				$('#registerForm').attr('name', 'subUserForm').attr('id', 'subUserForm');
	      				$('#initialRegistration').hide()
	      				$('#initialRegistrationSubmit').hide()
	      				$('#subRegistrationSubmit').show();
	      				$('#companyCode').show();
	      			} else {
	      				$('#registerForm').attr('name', 'registerForm').attr('id', 'registerForm');
	      			}
	      		})

	      		$('#initalRegister').change(function(){
	      			if(this.checked) {
	      				$('#registerForm').attr('name', 'registerForm').attr('id', 'registerForm');
	      				$('#initialRegistration').show();
	      				$('#initialRegistrationSubmit').show();
	      				$('#subRegistrationSubmit').hide()
	      				$('#companyCode').hide()
	      				$('#businessConfirm').hide()
	      			} else {
	      				$('#registerForm').attr('name', 'subUserForm').attr('id', 'subUserForm');
	      			}
	      		})



	      		$(document).on('submit', '#registerForm', function(e){
      				e.preventDefault();
  					var dataString = JSON.stringify($('#registerForm').serializeArray());
  					$.ajax({
  						type: 'POST',
  						url: domain + 'register/rest-user/',
  						data: dataString,
  					    contentType: "application/json",
  						success: function(response) {
  							$('#initialRegistration').fadeOut(500);	
  							$('#register-intro').fadeOut(500)
							$('#register-success').delay(520).fadeIn(500);		      				
  						},
  						error:function(errResponse) {
  							$('#initialRegistration').fadeOut(500);	
							$('#register-failure').delay(520).fadeIn(500);							
  						}
  					})
  				})

				$(document).on('submit', '#subUserForm', function(e){
      				e.preventDefault();
  					var dataString = JSON.stringify($('#subUserForm').serializeArray());
  					$.ajax({
  						type: 'POST',
  						url: domain + 'register/rest-subsequent-user-step2/',
  						data: dataString,
  					    contentType: "application/json",
  						success: function(response) {
  							console.log(response);
  						},
  						error:function(errResponse) {
  							console.log('fail')
  						}
  					})
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
  							var patentFound = true;
  							if(patentFound) {
  								$('#companyCodeSubmit').attr('disabled', true);
  								$('#companyCodeSubmit').parent().closest('div.form-group').hide();
  							}
  							$('#businessConfirm').show();
  							$('#businessNameConfirm').html(response.businessName);
  							$('#businessAddressStreetConfirm').html(response.street);
  							$('#businessAddressCityConfirm').html(response.city);
  							$('#businessAddressStateConfirm').html(response.USstate);
  							$('#businessAddressZipConfirm').html(response.zip); 							
  							$('input[id=businessName]').val(response.businessName);
  							$('input[id=phoneNumber]').val(response.phoneNumber);
  							$('#subBusiness input[id=street]').val(response.street);
  							$('#subBusiness input[id=city]').val(response.city);
  							$('#subBusiness input[id=USstate]').val(response.usstate);
  							$('#subBusiness input[id=zip]').val(response.zip);
  							$('#subBusiness input[id=timezone]').val(response.timezone);
  							$('#subBilling input[id=billing_street]').val(response.billingStreet);
  							$('#subBilling input[id=billing_city]').val(response.billingCity);
  							$('#subBilling input[id=billing_state]').val(response.billingState);
  							$('#subBilling input[id=billing_zip]').val(response.billingZip);

  						},
  						error: function(errResponse) {
  							console.log('fail')
  						}
  					})
  				})

  				$('#businessConfirmSubmit').click(function(e){

  					e.preventDefault()
					$('#businessConfirm').hide();
					$('#initialRegistration').show();
      				$('#subRegistration').hide()
      				$('#companyCode').hide()
      				$('#divQn').hide()

  				})



	      	})

     	</script>


      
   </body>
</html>
