<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>About p3sweb</title>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

</head>
<body>

<table border="0">

  <c:choose>
	<c:when test="${isloggedin}">
		 <tr>
			<td>You are logged in as:</td>
			<td>${me.emailAddress} &nbsp; &nbsp; &nbsp; &nbsp; (ID=${me.id})</td>
		 </tr>
		 <tr>
			<td>Your Name:</td>
			<td>${me.firstName} ${me.lastName}</td>  
		 </tr>
		 <tr>
			<td>Your Buisness:</td>
			<td>${myBusiness.businessName} &nbsp; &nbsp; &nbsp; &nbsp; (ID=${myBusiness.id})</td>
		 </tr>
		 <tr>
			<td>Your number of patents:</td>
			<td>${numpatents}</td>
		 </tr>
    </c:when>
    <c:otherwise>
		 <tr>
			<td>
				Login status:
			</td>
			<td>
				NOT logged in
			</td>
		 </tr> 
    </c:otherwise>
  </c:choose>



 <tr>
	<td>&nbsp;</td>
	<td></td>
 </tr>
 <tr>
	<td>Website build timestamp</td>
	<td>${buildtimestamp}</td>
 </tr>
 <tr>
	<td>Current Server timestamp</td>
	<td>${timestampnow}</td>
 </tr>
 <tr>
	<td>Using dB</td>
	<td>${dbname}</td>
 </tr>
 <tr>
	<td>Host</td>
	<td>${hostname}</td>
 </tr>
 <tr>
	<td>P3S product version</td>
	<td>${version}</td>
 </tr>

 <c:if test="${versionMessage != null}">
   <tr>
     <td>Version comment:</td>
     <td>${versionMessage}</td>
   </tr>
 </c:if>

</table>

</body>
</html>