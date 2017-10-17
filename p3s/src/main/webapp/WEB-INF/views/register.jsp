
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

      <title>Patent Place</title>

   	</head>

   	<body class="bg-light-grey"> 
      	<div class="pre-app-container d-flex justify-content-center align-items-center">
         	<div class="register-center-container p-a-sm border">
            	<div class="content-panel">
               		<div class="content-panel__head text-center">
                  		<div class="row">
                     		<div class="col-md-12  d-flex justify-content-center align-items-center">
                        		<div class="m-r-md">
                           			<img src="assets/imgs/logos/PP-Icon.png">
                        		</div>
                        		<h1 class="font-weight-bold">Register</h1>
                     		</div>
                  		</div>
               		</div>
               		<div class="content-panel__body bg-white">
               			<div class="row m-b-md" id="divQn">
               				<div class="col-md-6">
               					<span class="font-md font-weight-medium m-r-md">Is your firm already registered with Patent Place?</span>
	                            	<label class="form-check-label font-md m-r-sm">Yes</label><input type="radio" name="typeRegister" id="subRegister">
	                            	<label class="form-check-label font-md m-r-sm">No</label><input type="radio" name="typeRegister" id="initalRegister">	    	                            	
               				</div>
               			</div>
               			<div id="initialRegistration">
               				<div class="row">
	                  			<div class="col-md-12">
	                  				<form name="userDetails" id="userDetails" ng-controller="userProfileCtrl">
		                     			<div class="row m-b-lg">
		                     				<div class="col-md-6">
												<fieldset>
													<legend class="font-weight-bold font-xl m-b-sm">User Info</legend>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="emailAddress">Email address</label>
														<div class="col-md-7">
															<input type="email" name="emailAddress" class="form-control pill-radius" id="emailAddress" email required>
														</div>
													</div>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="firstName">First name</label>
														<div class="col-md-7">
															<input type="text" name="firstName" class="form-control pill-radius" id="firstName" required>
														</div>
													</div>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="lastName">Last name</label>
														<div class="col-md-7">
															<input type="text" class="form-control pill-radius" name="lastName"  id="lastName" required>
														</div>
													</div>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="new_password">Password</label>
														<div class="col-md-7">
															<input type="text" name="new_password" class="form-control pill-radius" id="new_password" minlength="8" required>
														</div>
													</div>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="confirm_password">Confirm password</label>
														<div class="col-md-7">
															<input type="text" name="confirm_password" class="form-control pill-radius" id="confirm_password" required>
														</div>
													</div>
												</fieldset>
											</div>
											<div class="col-md-6">
												<fieldset>
													<div class="row">
														<div class="col-md-5">
															<legend class="font-weight-bold m-b-sm">Billing Address</legend>
														</div>
														<div class="col-md-7">
															<div class="row d-flex align-items-center">
																<div class="col-md-8">
																	<p class="font-sm font-weight-medium">Same as business address?</p>
																</div>
																<div class="col-md-4">
																	<div class="row m-t-xs">
																		<div class="col-md-4">
																			<div class="onoffswitch">
																				<label class="switch font-sm">
																				  <input type="checkbox" name="same_as_business" id="same_as_business">
																				  <span class="slider round"></span>
																				</label>
																			</div>
																		</div>							
																	</div>
																</div>									
															</div>

														</div>														
													</div>
													<div id="subBilling">
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="billing_street">Street</label>
															<div class="col-md-7">
																<input type="text" name="billingStreet" class="form-control pill-radius" id="billing_street" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="billing_city">City</label>
															<div class="col-md-7">
																<input type="text" name="billingCity" class="form-control pill-radius" id="billing_city" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="billing_state">State</label>
															<div class="col-md-7">
																<input type="text" name="billingState" class="form-control pill-radius" id="billing_state" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="billing_zip">Zip</label>
															<div class="col-md-7">
																<input type="text" name="billingZip" class="form-control pill-radius" id="billing_zip" required>
															</div>
														</div>
													</div>
												</fieldset>
												<div class="row m-b-xs">
							                        <label class="form-check-label font-md col-md-12">
						                            	I accept the <span class="font-weight-bold m-r-xs">Terms and Conditions</span> 
						                            	<input type="checkbox" name="terms-register" id="terms-register">
						                       	 	</label>									
												</div>
												<div class="row">
													<div class="offset-md-8 col-md-4">
								                        <button class="btn btn-block bg-phase-green pill-radius txt-white font-lg font-weight-medium p-wide-sm" type="submit" id="submit" disabled>Submit</button>									
													</div>
												</div>		
											</div>
		                     			</div>
										<div class="row">
											<div class="col-md-6">
												<fieldset>
													<legend class="font-weight-bold">Business Address</legend>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="businessName">Business name</label>
														<div class="col-md-7">
															<input type="text" name="businessName" class="form-control pill-radius" id="businessName" required>
															
														</div>
													</div>
													<div class="form-group row">
														<label class="col-md-5 font-md font-weight-medium" for="phoneNumber">Business phone number</label>
														<div class="col-md-7">
															<input type="text" name="phoneNumber" class="form-control pill-radius" id="phoneNumber" required>
																			
														</div>
													</div>
													<div id="subBusiness">
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="street">Street</label>
															<div class="col-md-7">
																<input type="text" name="street" class="form-control pill-radius" id="street" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="city">City</label>
															<div class="col-md-7">
																<input type="text" name="city" class="form-control pill-radius" id="city" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="usstate">State</label>
															<div class="col-md-7">
																<input type="text" name="usstate" class="form-control pill-radius" id="usstate" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="zip">Zip</label>
															<div class="col-md-7">
																<input type="text" name="zip" class="form-control pill-radius" id="zip" required>
															</div>
														</div>
														<div class="form-group row">
															<label class="col-md-5 font-md font-weight-medium" for="timezone">Time Zone</label>
															<div class="col-md-2">
																<!-- <select class="form-control pill-radius">
																	<option class="form-control"></option>
																</select> -->
																<input type="text" name="timezone" class="form-control pill-radius" id="timezone" required>
															</div>
														</div>
													</div>
													
												</fieldset>
											</div>
										</div>
									</form>
	                  			</div>
	                  		</div>
               			</div>
               			<div id="companyCode">
               				<div class="row">
               					<div class="col-md-6">
               						<form name="companyCodeForm" id="companyCodeForm">
               							<div class="form-group">
               								<label class="col-md-5 font-md font-weight-medium">Business Number</label>
               								<input class="form-control pill-radius" name="businessNumber"></input>
               							</div>
               							<div class="form-group">
               								<label class="col-md-5 font-md font-weight-medium">Business PIN</label>
               								<input class="form-control pill-radius" name="businessPin"></input>
               							</div>               							
               							<div class="form-group">
               								<input type="submit" name="companyCodeSubmit" class="btn btn-block bg-phase-green pill-radius txt-white font-lg font-weight-medium p-wide-sm">
               							</div>
               						</form>
               					</div>
               				</div>
               			</div>
               		</div>
            	</div>
         	</div>         
      	</div>

      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.serializeJSON.min.js"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

      	<script>
      	
	      	$(document).ready(function(){

	      		$('#initialRegistration').hide();
	      		$('#subRegistration').hide();
	      		$('#companyCode').hide();

	      		$('#same_as_business').change(function(){
	      			if(this.checked) {
	      				var addObj = {}
	      				var business = $('#copyBusiness input');
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
	      				$('#submit').removeAttr('disabled');
	      			} else {
	      				$('#submit').prop('disabled', true);
	      			}
	      		})

	      		$('#subRegister').change(function(){
	      			if(this.checked) {
	      				$('#initialRegistration').hide();
	      				$('#companyCode').show();
	      			}
	      		})

      			$('#companyCodeForm').submit(function(e){
      				e.preventDefault();
  					var dataString = $('#companyCodeForm').serializeArray();
  					
  					console.log(dataString);
  					
  					$.ajax({
  						type: 'POST',
  						//url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step1/'+dataString,
  						url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step1/',
  						data: dataString,
  					    dataType: 'json',
  						success: function(response) {
  							console.log(response);
  							console.log(response.street);
  							$('#initialRegistration').show();
  		      				$('#subRegistration').hide();
  		      				$('#companyCode').hide();
  		      				$('#divQn').hide();
  							//var data = response.data;
  							alert(response.businessName);
  							alert(response.phoneNumber);
  							$('input[id=businessName]').val(response.businessName);
  							$('input[id=phoneNumber]').val(response.phoneNumber);
  							$('#subBusiness input[id=street]').val(response.street);
  							$('#subBusiness input[id=city]').val(response.city);
  							$('#subBusiness input[id=usstate]').val(response.usstate);
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

  				$('#userDetails').submit(function(e){
      				e.preventDefault();
  					var dataString = $('#userDetails').serializeArray();
  					$.ajax({
  						type: 'POST',
  						//url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step1/'+dataString,
  						url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step2/',
  						data: JSON.stringify(dataString),
  					    contentType: "application/json",
  						success: function(response) {
  							console.log(response);
  						},
  						error:function(errResponse) {
  							console.log('fail')
  						}
  					})
  				})
  				
	      		$('#initalRegister').change(function(){
	      			if(this.checked) {
	      				$('#initialRegistration').show();
	      				$('#subRegistration').hide();
	      				
	      			}
	      		})
	      	})

     	</script>
      
   </body>
</html>
