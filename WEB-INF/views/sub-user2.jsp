<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Patent Place</title>
	<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<%@ taglib uri = "http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
	
	<link rel="stylesheet" type="text/css" href="styles/normalize.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="styles/style.css">
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	
	<script>
	$(document).ready(function(){
		
		
		var $select = $('#timezone');
		
		//request the JSON data and parse into the select element
		$.ajax({
		  type:"GET",
		  url: '../public/timezones.json',
		  dataType:'JSON',
		  success:function(data){
			//alert("Inside success");
		    $select.html('');
		    $.each(data.timezones, function(key, val){
		      $select.append('<option id="' + val.abbr + '">' + val.abbr + '</option>');
		    })
		  },
		  error:function(){
		    //alert("Inside error");
		  }
		});
		
		
		 $('#isBillingAddressSame').change(function(){
			alert("Inside function");
		     if($(this).is(":checked")){
		    	 //$(this).val('true');
		    	 $('#isBillingAddressSame').prop('value', "true");
		    	 //alert($('#isBillingAddressSame').prop('value'));
		        // alert("Value set as true");
		     }else{
		    	
		    	 $('#isBillingAddressSame').prop('value', "false");
		    	 //alert($('#isBillingAddressSame').prop('value'));
		     }
		}); 
		
		
        /* $("#isBillingAddressSame").is(':checked', function(){
        	alert("Inside again");
            $("#isBillingAddressSame").prop('value', 'true');
        }); */
  
		
	}); 
	
	</script>	
	
</head>
<body>
	<c:if test="${not empty error}">
	   <font color="red">
	   		Error: ${error}
	   	</font>
	</c:if>
	<form  action="<c:url value='/prelogin/sub-user2' />" method="POST">
		<div class="col-md-6">
			<fieldset>
				<legend class="font-weight-bold">User Info</legend>
				<div class="form-group row">
					<label class="col-md-5" for="emailAddress">Email address</label>
					<div class="col-md-7">
						<input type="text" name="emailAddress" class="form-control" id="emailAddress" value='${user.emailAddress}' >
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="firstName">First name</label>
					<div class="col-md-7">
						<input type="text" name="firstName" class="form-control" id="firstName"  value='${user.firstName}'>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="lastName">Last name</label>
					<div class="col-md-7">
						<input type="text" class="form-control" name="lastName"   id="lastName" value='${user.lastName}'>
					</div>
				</div>
			</fieldset>
			
			
			<fieldset>
				<legend class="font-weight-bold">Password</legend>
				<div class="form-group row">
					<label class="col-md-5" for="password">Password</label>
					<div class="col-md-7">
						<input type="text" name="password"  class="form-control" id="new_password" >
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="confirm_password">Confirm password</label>
					<div class="col-md-7">
						<input type="text" name="confirm_password" class="form-control" ng-model="confirm_password" id="confirmPassword" required>
					</div>
				</div>
			</fieldset>
	
			<fieldset class="form-group">
				<legend class="font-weight-bold">Email notifications</legend>
				<p>Do you want to receive email notifications?</p>
				<div class="col-md-2">
					<label class="form-check-label">
		    			<input type="radio" class="form-check-input" name="isEmailNotification" id="isEmailNotification" value="Yes">
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
				<legend class="font-weight-bold">Pre-populating Business Details </legend>
				<legend class="font-weight-bold">Business details</legend>
				<div class="form-group row">
					<label class="col-md-5" for="businessName">Business name</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.businessName" class="form-control" value='${user.business.businessName}' id="businessName" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="phoneNumber">Business phone number</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.phoneNumber" class="form-control" value='${user.business.phoneNumber}' id="phoneNumber" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="street">Street</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.street" class="form-control" value='${user.business.street}' id="street" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="city">City</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.city" class="form-control" value='${user.business.city}' id="city" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="USstate">State</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.USstate" class="form-control" value='${user.business.USstate}' id="USstate" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="zip">Zip</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.zip" class="form-control" value='${user.business.zip}' id="zip" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="timezone">Time Zone</label>
					<div class="col-md-2">
						<input readonly="readonly" class="form-control" id="timezone" name="business.timezone" value='${user.business.timezone}' ng-model="selected_timezone" ng-options="x.abbr for x in timezone"/>
						
					</div>
					
				</div>
			</fieldset>
		</div>
	
		<div class="col-offset-6 col-md-6">
			<fieldset>
				<legend class="font-weight-bold">Billing address</legend>
				<div class="form-group row">
					<label class="col-md-5" for="billingStreet">Street</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.billingStreet" class="form-control" value='${user.business.billingStreet}' id="billing_street" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billingCity">City</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.billingCity" class="form-control" value='${user.business.billingCity}' id="billing_city" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billing_state">State</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.billingState" class="form-control" value='${user.business.billingState}' id="billing_state" required>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="billingZip">Zip</label>
					<div class="col-md-7">
						<input readonly="readonly" type="text" name="business.billingZip" class="form-control" value='${user.business.billingZip}' id="billing_zip" required>
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