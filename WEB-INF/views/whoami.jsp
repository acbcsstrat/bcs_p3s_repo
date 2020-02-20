<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>

<table border="0">
 <tr>
	<td>You are logged in as:</td>
	<td>${me.emailAddress} &nbsp; &nbsp; &nbsp; &nbsp; (ID=${me.id})</td>
 </tr>
 <tr>
	<td>You are:</td>
	<td>${me.firstName} ${me.lastName}</td>  
 </tr>
 <tr>
	<td>Your Buisness is:</td>
	<td>${myBusiness.businessName} &nbsp; &nbsp; &nbsp; &nbsp; (ID=${myBusiness.id})</td>
 </tr>
 <tr>
	<td>Your number of patents:</td>
	<td>${numpatents}</td>
 </tr>
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
<<<<<<< HEAD
	<td>v3.2</td>
 </tr>
=======
<<<<<<< HEAD
	<td>v3.1dev (with Avatar2)</td>
=======
<<<<<<< HEAD
	<td>v3.2</td>
=======

	<td>v3.1</td>
	<td>v3.1dev (with Avatar2)</td>
>>>>>>> fe-branch-planb
 </tr>
>>>>>>> fe-branch-planb
>>>>>>> fe-branch-v4
</table>

</body>
</html>