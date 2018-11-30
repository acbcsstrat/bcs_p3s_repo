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

Server time: ${timeStr}
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
		<form action="writemc" method="GET" >						
			<input type="submit" name="writemc" value="Write MC SFTP"  /> 
		</form>
    </td>
    <td>
		<form action="readmc" method="GET" >						
			<input type="submit" name="readmc" value="Read MC SFTP"  /> 
		</form>
    </td>
    <td>
		<form action="followon" method="GET" >						
			<input type="submit" name="readmc" value="Followon after EPO Instructed"  /> 
		</form>
    </td>
    <td>
		<form action="readepo" method="GET" >						
			<input type="submit" name="readmc" value="Read EPO latest"  /> 
		</form>
    </td>
  </tr>
</table>


<p/>



<p/>
&nbsp;
<p/>
<a href="/p3sharness/listtxns">Refresh</a>
<p/>
<a href="/p3sharness/logout">logout</a>
<p/>
&nbsp;
<p/>
To indicate that the EPO has been instructed to renew all patents in a transaction:
<br/>
<ul>
<li>
For that transaction, select <i>P3S: EPO Instructed</i> from the dropdown, then press the Submit button 
</li>
<li>
(This immediately (well, 20 seconds+) updates the Transaction status, but <b>not yet</b> the status of associated patents) 
</li>
<li>
CHECK: Press <i>Refresh</i> hyperlink, Status should have changed. Also login to app & view Transaction and Patent(s) status
</li>
<li>
Press the <i>Followon after EPO Instructed</i> button.
</li>
<li>
(This immediately updates the <b>patent</b> status(s)) 
</li>
<li>
The change is now complete. Login to app & verify. 
</li>
<li>
Now wait (days) for the EPO to publish the renewals, whereupon certificate emails will be automatically sent for each patent. 
</li>
</ul>  
<p/>
Note: that <i>P3S: EPO Instructed</i> is the ONLY dropdown value you should use in a Production environment. 

<p/>
<I>dev note: <a href="swappatentnumber.jsp">devPage</a></I> 



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
