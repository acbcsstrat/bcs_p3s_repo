
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

   	<body class="bg-light-grey hide-before"> 
      	<div class="container-pre-app d-flex justify-content-center align-items-center">
         	<div class="container-pre-app__center-box-40 p-a-sm border">
            	<div class="content-panel">
              		<div class="row m-b-sm">
	                     <div class="col-md-12 d-flex justify-content-center align-items-center flex-column">
	                        <div class="m-b-sm">
	                           <img src="assets/imgs/logos/PP_icon_lg.png">
	                        </div>
	                        <h1 class="font-weight-bold font-h1">Register</h1>
	                     </div>
              		</div>
               		<div class="d-flex align-items-center flex-column">
               			<div class="row m-b-sm">
               				<div class="col-md-12">
               					<a href="/p3sweb/login" class="font-body txt-phase-green font-weight-medium">Already have user account set up?</a>
               				</div>
               			</div>
               			<div class="row m-b-md" id="divQn">
               				<div class="col-md-12">
               					<span class="font-body font-weight-medium m-r-md">Firm already registered?</span>
                            	<label class="form-check-label font-body m-r-sm">Yes<input class="m-l-xs" type="radio" name="typeRegister" id="subRegister"></label>
                            	<label class="form-check-label font-body m-r-sm">No<input class="m-l-xs" type="radio" name="typeRegister" id="initalRegister"></label>
               				</div>
               			</div>
               			<div id="initialRegistration">
               				<div class="row">
	                  			<div class="col-md-12">
	                  				<form name="" id="registerForm" class="form">
	                  					<div class="m-b-md">
		                  					<ul class="nav nav-pills view-tabs" role="tablist" id="registerTabs">
											  	<li class="tab tab--lg nav-item nav-view-list-item pill-tabs font-h4 border-grey-xs">
											    	<a class="nav-view-link btn--lg pill-radius bg-white active" href="#userDetails" role="tab" data-toggle="tab">User</a>
											  	</li>
											  	<li class="tab tab--lg nav-item nav-view-list-item  pill-tabs font-h4 border-grey-xs">
											    	<a class="nav-view-link btn--lg pill-radius bg-white disabled" href="#businessDetails" role="tab" data-toggle="tab">Address</a>
											  	</li>
											  	<li class="tab tab--lg nav-item nav-view-list-item pill-tabs font-h4 border-grey-xs">
											    	<a class="nav-view-link btn--lg pill-radius bg-white disabled" href="#billingDetails" role="tab" data-toggle="tab">Billing</a>
											  	</li>
											</ul>	                  						
	                  					</div>


											<!-- Tab panes -->
										<div class="tab-content">
										  	<div role="tabpanel" class="tab-pane fade in active" id="userDetails">
										  		<div class="m-b-sm">
													<fieldset id="userSet">
														<div class="form-group row">
															<div class="col-md-12">
																<input type="email" name="emailAddress" class="form-control pill-radius font-body" id="emailAddress" placeholder="Email" email required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="firstName" class="form-control pill-radius font-body" id="firstName" placeholder="First Name" required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" class="form-control pill-radius font-body" name="lastName"  id="lastName" placeholder="Last Name" required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="password" name="password" class="form-control pill-radius font-body" id="password" minlength="8" placeholder="Password">
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="password" name="confirm_password" class="form-control pill-radius font-body" id="confirm_password" placeholder="Confirm Password" required>
															</div>
														</div>
													</fieldset>										  			
										  		</div>
										  		<div class="row">
										  			<div class="col-md-12 d-flex justify-content-end">
										  				<button type="button" class="btn btn--reg pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer" id="businessForm" disabled>Next Step</button>
										  			</div>
										  		</div>
												
											</div>
										  	<div role="tabpanel" class="tab-pane fade" id="businessDetails">
										  		<div class="m-b-md">
													<fieldset id="businessSet">
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="businessName" class="form-control pill-radius font-body" id="businessName" placeholder="Business Name" required>
																
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="phoneNumber" class="form-control pill-radius font-body" id="phoneNumber" placeholder="Tel" required>
																				
															</div>
														</div>
														<div id="subBusiness">
															<div class="form-group row">
																<div class="col-md-12">
																	<input type="text" name="street" class="form-control pill-radius font-body" id="street" placeholder="Street" required>
																</div>
															</div>
															<div class="form-group row">
																<div class="col-md-12">
																	<input type="text" name="city" class="form-control pill-radius font-body" id="city" placeholder="City" required>
																</div>
															</div>
															<div class="form-group row">
																<div class="col-md-12">
																	<input type="text" name="USstate" class="form-control pill-radius font-body" id="USstate" placeholder="State" required>
																</div>
															</div>
															<div class="form-group row">
																<div class="col-md-6">
																	<input type="text" name="zip" class="form-control pill-radius font-body" id="zip" placeholder="Zip" required>
																</div>
																<div class="col-md-6">
																	<select class="form-control pill-radius font-body form-control" name="timezone" id="timezone" selected="Time Zone">
																		<option class="form-control">ET</option>
																		<option class="form-control">CT</option>
																		<option class="form-control">MT</option>
																		<option class="form-control">PT</option>
																		<option class="form-control">AKT</option>
																		<option class="form-control">AKT</option>
																	</select>
																</div>
															</div>
														</div>
													</fieldset>
												</div>
										  		<div class="row">
										  			<div class="col-md-12 d-flex justify-content-between">
										  				<button type="button" class="btn btn--reg pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer" id="userForm">Prev Step</button>
										  				<button type="button" class="btn btn--reg pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer" id="billingForm" disabled>Next Step</button>
										  			</div>
										  		</div>
										  	</div>
										  	<div role="tabpanel" class="tab-pane fade" id="billingDetails">
												<fieldset id="billingSet">
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
																<input type="text" name="billingStreet" class="form-control pill-radius font-body" id="billing_street" placeholder="Street" required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="billingCity" class="form-control pill-radius font-body" id="billing_city" placeholder="City" required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="billingState" class="form-control pill-radius font-body" id="billing_state" placeholder="State" required>
															</div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<input type="text" name="billingZip" class="form-control pill-radius font-body" id="billing_zip" placeholder="Zip" required>
															</div>
														</div>
													</div>
												</fieldset>
												<div class="row m-b-sm">
							                        <label class="form-check-label font-body col-md-12">
						                            	I accept the <span class="font-weight-bold m-r-xs">Terms and Conditions</span> 
						                            	<input type="checkbox" name="terms-register" id="terms-register">
						                       	 	</label>									
												</div>
												<div class="row">
													<div class="col-md-12 d-flex justify-content-between">
										  				<button type="button" class="btn btn--reg pill-radius bg-phase-green font-body txt-white font-weight-medium cursor-pointer" id="prevBusinessForm">Prev Step</button>
								                        <button class="btn btn--reg bg-phase-green pill-radius txt-white font-body font-weight-medium" type="submit" id="register" disabled>Register</button>
<!-- 								                        <button class="btn btnreg bg-phase-green pill-radius txt-white font-body font-weight-medium" type="submit" id="subRegistrationSubmit" disabled>Registerr</button>		 -->									                        			
													</div>
												</div>
											</div>
									  	</div> <!--tab content -->										
									</form>
	                  			</div>
	                  		</div>
               			</div>
               		</div>
           			<div id="companyCode">
           				<div class="row">
           					<div class="col-md-12 d-flex justify-content-center flex-column align-items-center">
           						<div class="container-pre-app__center-box-70">
	           						<form name="companyCodeForm" id="companyCodeForm">
	           							<div class="form-group row">
	           								<div class="col-md-12">
	           									<input class="form-control pill-radius font-body" name="businessNumber" placeholder="Business Number">
	           								</div>
	           							</div>
	           							<div class="form-group row">
	           								<div class="col-md-12">
	           									<input class="form-control pill-radius font-body" name="businessPin" placeholder="Business PIN">
	           								</div>
	           							</div>               							
	           							<div class="form-group row">
	           								<div class="col-md-7 offset-md-5">
	           									<input type="submit" name="companyCodeSubmit" id="companyCodeSubmit" class="btn btn-block bg-phase-green pill-radius txt-white font-body font-weight-medium p-wide-sm" value="Search">
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
           						<div class="m-b-sm">
	   								<table class="table font-body bg-white t-data">
	           							<tr>
	           								<td class="font-weight-medium">Business</td>
	           								<td id="businessNameConfirm"></td>
	           							</tr>
	           							<tr>
	           								<td class="font-weight-medium">Address</td>
	           								<td>
	           									<span id="businessAddressStreetConfirm"></span><br>
	           									<span id="businessAddressCityConfirm"></span><br>
	           									<span id="businessAddressStateConfirm"></span><br>
	           									<span id="businessAddressZipConfirm"></span>
	           								</td>
	           							</tr>               							
	           						</table>           							
           						</div>
           						<div class="row">
       								<div class="col-md-12 d-flex justify-content-end align-items-center">
       									<p class="font-weight-medium font-body m-r-sm">Is this the correct business?</p>
       									<input type="submit" id="businessConfirmSubmit" name="businessConfirmSubmit" class="btn bg-phase-green pill-radius txt-white font-body font-weight-medium btn--lg m-r-xs" value="Yes">	       									
       									<input type="submit" id="businessConfirmSubmit" name="businessConfirmSubmit" class="btn bg-phase-red pill-radius txt-white font-body font-weight-medium btn--lg" value="No">
       								</div>
       							</div>
           					</div>
           				</div>
       				</div>		               				
       			</div>
         	</div>         
      	</div>

      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/2.8.1/jquery.serializejson.min.js"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
      	<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>      	

      	<script>

      		$('#initialRegistration').hide();
      		$('#companyCode').hide();
      		$('#businessConfirm').hide();

      		$(window).on('load',function() {
			 	$('.hide-before').fadeIn(500);
			});
      	
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
					e.preventDefault();
					$('#registerTabs a[href*="userDetails"').tab('show');
				})

				prevBusinessForm.click(function(e){
					e.preventDefault();
					$('#registerTabs a[href*="businessDetails"').tab('show');
				})

				businessForm.click(function(e){
					e.preventDefault();
					$('#registerTabs a[href*="businessDetails"').tab('show');
				})

				billingForm.click(function(e){
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
	  						console.log('false')
	  						valid = false;
	  					} else {
	  						console.log('true')
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
	      				$('#registerForm').attr('name', 'initialUserForm').attr('id', 'initialUserForm');
	      			}
	      		})

	      		$('#initalRegister').change(function(){
	      			if(this.checked) {
	      				$('#registerForm').attr('name', 'initialUserForm').attr('id', 'initialUserForm');
	      				$('#initialRegistration').show();
	      				$('#initialRegistrationSubmit').show();
	      				$('#subRegistrationSubmit').hide()
	      				$('#companyCode').hide()
	      				$('#businessConfirm').hide()
	      			} else {
	      				$('#registerForm').attr('name', 'subUserForm').attr('id', 'subUserForm');
	      			}
	      		})

	      		$(document).on('submit', '#initialUserForm', function(e){
  					console.log('initial');
      				e.preventDefault();
  					var dataString = JSON.stringify($('#initialUserForm').serializeArray());
  					$.ajax({
  						type: 'POST',
  						url: 'http://localhost:8080/p3sweb/register/rest-user/',
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

				$(document).on('submit', '#subUserForm', function(e){
  					console.log('sub');
      				e.preventDefault();
  					var dataString = JSON.stringify($('#subUserForm').serializeArray());
  					$.ajax({
  						type: 'POST',
  						url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step2/',
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
  						url: 'http://localhost:8080/p3sweb/register/rest-subsequent-user-step1/',
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
