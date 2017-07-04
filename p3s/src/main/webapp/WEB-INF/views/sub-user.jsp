<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title> Patent Place </title>
	<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<%@ taglib uri = "http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
	<link rel="stylesheet" type="text/css" href="styles/normalize.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="styles/style.css">
	
</head>
<body>
	
	<c:if test="${not empty error}">
	   <font color="red">
	   		Error: ${error}
	   	</font>
	</c:if>

	<form  action="<c:url value='/prelogin/sub-user' />" method="POST">
		<div class="col-md-6">
			<fieldset>
				<legend class="font-weight-bold">Business Info</legend>
				<div class="form-group row">
					<label class="col-md-5" for="businessNumber">Business Number</label>
					<div class="col-md-7">
						<input type="text" name="businessNumber" class="form-control" id="businessNumber" value='${business.businessNumber}' required/>
					</div>
				</div>
				<div class="form-group row">
					<label class="col-md-5" for="businessPin">Business Pin</label>
					<div class="col-md-7">
						<input type="text" name="businessPin" class="form-control" id="businessPin" value='${business.businessPin}' required/>
					</div>
				</div>
			</fieldset>
			
			<div class="col-offset-6 col-md-6">
				<button class="btn btn-success" type="submit">Submit</button>
				<a href="../login">Back</a>
			</div>
		</div>
	</form>
			
</body>
</html>