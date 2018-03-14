<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">

   <head>

      <title>P3S Harness</title>

   	</head>

   	<body > 
<%@ page import="com.bcs.p3s.model.Txn,java.util.List" %>

<p/>
&nbsp;
<p/>


<% List<Txn> txn = null; %>

<table border="1">
<c:forEach items="${txns}" var="txn">
	<form action="changestatus" method="POST" >							
	    <tr>
			<td>
				${txn.email} 
			</td>
			<td>
				${txn.fname} 
			</td>
			<td>
				${txn.lname} 
			</td>
			<td>
				${txn.p3sref} 
			</td>
			<td>
				${txn.createdate} 
			</td>
			<td>
				${txn.numpatents} 
			</td>
			<td>
				${txn.status} 
			</td>
			<td>
				<select name="nextstate">
				  ${options}
				</select>
			</td>
			<td>
				<input type="hidden" name="p3sref" value="${txn.p3sref}" /> 
				<input type="submit" name="Submit" id="sub${txn.counter}" onclick="disableallbuttons(); this.form.submit(); " /> 
			</td>
	    </tr>
	</form>
</c:forEach>
</table>


<table>
  <tr>
    <td>
		<form action="readmc" method="GET" >						
			<input type="submit" name="readmc" value="Read MC SFTP"  /> 
		</form>
    </td>
    <td>
		<form action="readepo" method="GET" >						
			<input type="submit" name="readmc" value="Read EPO latest"  /> 
		</form>
    </td>
    <td>
		<form action="followon" method="GET" >						
			<input type="submit" name="readmc" value="Followon after EPO Instructed"  /> 
		</form>
    </td>
  </tr>
</table>


<p/>



<p/>
&nbsp;
<p/>
<a href="/harness/listtxns">Refresh</a>
<p/>
<a href="/harness/logout">logout</a>
<p/>
<a href="harness/logout">logout</a>
<p/>
<a href="http://localhost:8080/harness/logout">logout</a>

   </body>


	<script>
		function disableallbuttons() {
			for (ii = 0; ii < ${numtxns}; ii++) { 
				var str2 = ii.toString();
				var btnId = 'sub'.concat(str2);
				document.getElementById(btnId).disabled = true;
			}
		}
	</script>



</html>
