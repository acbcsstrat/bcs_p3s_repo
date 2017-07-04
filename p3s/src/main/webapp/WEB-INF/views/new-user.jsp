<!doctype html>
<html lang="en">
<head>
	<title>P3S Login</title>
	<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<%@ taglib uri = "http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
	
	<link rel="stylesheet" type="text/css" href="styles/normalize.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="styles/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	
	<script>
	 $(function() {
		$('#isBillingAddressSame').change(function(){
			alert("Inside function");
		     if($(this).is(":checked")){
		    	 //$(this).val('true');
		    	 $('#isBillingAddressSame').attr('value', true);
		          alert("Value set as true");
		     }else{
		    	 //$(this).val('false');
		    	 $('#isBillingAddressSame').attr('value', false);
		          alert("Value set as false");
		     }
		});
	}); 
	
	</script>	
</head>

<body>

	<c:if test="${not empty error}">
		<font color="red">
	   		Error: ${error}
	   	</font>
	</c:if>
	<form  action="<c:url value='/prelogin/new-user' />" method="POST">
		<div class="col-md-6">
			<fieldset>
				<legend class="font-weight-bold">User Info</legend>
				<div class="form-group row">
					<label class="col-md-5" for="emailAddress">Email address</label>
					<div class="col-md-7">
						<input type="email" name="emailAddress" class="form-control" id="emailAddress" value='${p3sUser.emailAddress}' }>
						
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="firstName">First name</label>
					<div class="col-md-7">
						<input type="text" name="firstName" class="form-control" id="firstName" value='${p3sUser.firstName}' required>
						
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="lastName">Last name</label>
					<div class="col-md-7">
						<input type="text" class="form-control" name="lastName"   id="lastName" value='${p3sUser.lastName}' required>
						
	
					</div>
				</div>
			</fieldset>
			
			
			<fieldset>
				<legend class="font-weight-bold">Password</legend>
				<div class="form-group row">
					<label class="col-md-5" for="password">Password</label>
					<div class="col-md-7">
						<input type="text" name="password"  class="form-control" id="password" required>
						
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="confirm_password">Confirm password</label>
					<div class="col-md-7">
						<input type="text" name="confirm_password" class="form-control" id="confirmPassword" required>
						
					</div>
				</div>
			</fieldset>
	
			<fieldset class="form-group">
				<legend class="font-weight-bold">Email notifications</legend>
				<p>Do you want to receive email notifications?</p>
				<div class="col-md-2">
					<label class="form-check-label">
		    			<input type="radio" class="form-check-input" name="isEmailNotification" id="isEmailNotification" value="Yes" required>
						Yes
					</label>				
				</div>
				<div class="col-md-2">
				  	<label class="form-check-label">
		    			<input type="radio" class="form-check-input" name="isEmailNotification" id="isEmailNotification" value="No">
						No
					</label>
				</div>
			</fieldset>					
		</div>
		<div class="col-md-6">
			<fieldset>
				<legend class="font-weight-bold">Business details</legend>
				<div class="form-group row">
					<label class="col-md-5" for="businessName">Business name</label>
					<div class="col-md-7">
						<input type="text" name="business.businessName" class="form-control" value='${p3sUser.business.businessName}' id="businessName" required>
						
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="phoneNumber">Business phone number</label>
					<div class="col-md-7">
						<input type="text" name="business.phoneNumber" class="form-control" value='${p3sUser.business.phoneNumber}' id="phoneNumber" required>
										
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="street">Street</label>
					<div class="col-md-7">
						<input type="text" name="business.street" class="form-control" value='${p3sUser.business.street}' id="street" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="city">City</label>
					<div class="col-md-7">
						<input type="text" name="business.city" class="form-control" value='${p3sUser.business.city}' id="city" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="USstate">State</label>
					<div class="col-md-7">
						<input type="text" name="business.USstate" class="form-control" value='${p3sUser.business.USstate}' id="USstate" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="zip">Zip</label>
					<div class="col-md-7">
						<input type="text" name="business.zip" class="form-control" value='${p3sUser.business.zip}' id="zip" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="timezone">Time Zone</label>
					<div class="col-md-2">
						<select class="form-control" ng-model="selected_timezone" ng-options="x.abbr for x in timezone">
							<option class="form-control" ng-model="user.timezone"></option>
						</select>
					</div>
					
				</div>
			</fieldset>
		</div>
	
		<div class="col-offset-6 col-md-6">
			<fieldset>
				<legend class="font-weight-bold">Billing address</legend>
				<input type="checkbox" name="business.isBillingAddressSame" id="isBillingAddressSame" checked="checked"/> <p>Is billing address same as your business address? </p>
				<div class="form-group row">
					<label class="col-md-5" for="billingStreet">Street</label>
					<div class="col-md-7">
						<input type="text" name="business.billingStreet" class="form-control" value='${p3sUser.business.billingStreet}' id="billing_street" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billingCity">City</label>
					<div class="col-md-7">
						<input type="text" name="business.billingCity" class="form-control" value='${p3sUser.business.billingCity}' id="billing_city" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billing_state">State</label>
					<div class="col-md-7">
						<input type="text" name="business.billingState" class="form-control" value='${p3sUser.business.billingState}' id="billing_state" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billingZip">Zip</label>
					<div class="col-md-7">
						<input type="text" name="business.billingZip" class="form-control" value='${p3sUser.business.billingZip}' id="billing_zip" required>
					</div>
				</div>
			</fieldset>
			
		</div>
		<div class="col-offset-6 col-md-6">
			<button class="btn btn-success" type="submit">Submit</button>
		</div>
	
	</form>
	
		
</body>
</html>