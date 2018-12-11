<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!doctype html>
<html lang="en">

<head>

<title>P3S Harness</title>

</head>

<body>
	<%@ page import="com.bcs.p3s.model.Txn,java.util.List"%>
	<!--  AbstractSellableProduct -->
	<%@ page import="com.bcs.p3s.model.Patent"%>
	<%@ page import="com.bcs.p3s.model.Epct"%>
	<%@ page import="com.bcs.p3s.model.Renewal"%>
	<%@ page import="com.bcs.p3s.display.TxnProduct"%>




	Server time: ${timeStr}
	<p />
	&nbsp;
	<p />
	<b>Euro-PCTs - Prior to Commitment to purchase</b>
	<p />
	&nbsp;
	<p />



	<table border="1">
		<tr>
			<th>epct#</th>
			<th>patentAppNum</th>
			<th>patent#</th>
			<th>business#</th>
			<th>businessName</th>
			<th>epctStatus</th>
			<th colspan="2">Change Status</th>
			<th>Upload PDF</th>
			<th>Form1200 PDF</th>
			<th>expiryDate</th>
			<th>createdBy</th>
			<th>createdDate</th>
		</tr>



		<c:forEach items="${epcts}" var="epct">
			<form action="changeepctstatus" method="POST">
				<tr>
					<td>${epct.id}</td>
					<td>${epct.patent.EP_ApplicationNumber}</td>
					<td>${epct.patent.id}</td>
					<td>${epct.patent.business.id}</td>
					<td>${epct.patent.business.businessName}</td>
					<td>${epct.epctStatus}</td>
					<td><select name="nextstate">
							<option value="Await pdf gen start">Await pdf gen start</option>
							<option value="Epct being generated">Epct being generated</option>
							<option value="Epct saved" selected="selected">Epct saved</option>
					</select></td>
					<td><input type="hidden" name="epctId" value="${epct.id}" />
						<input type="submit" name="Submit" id="sub${epct.id}"
						onclick="this.form.submit(); " /></td>
					<td><a href="/p3sharness/pdfuploadform.jsp?epctId=${epct.id}">upload</a>
					</td>
					<td>
						<c:if test="${epct.form1200 != null}">
							&nbsp;
							<a href="/p3sharness/download.pdf?epctId=${epct.id}" target="_blank">View</a>
							&nbsp;&nbsp; 
							<a href="/p3sharness/download.pdf?epctId=${epct.id}&download=true" download target="_blank">Download</a>
							&nbsp;
						</c:if> 
					</td>
					<td>${epct.epctApplicationExpiryDate}</td>
					<td>${epct.createdBy.firstName} ${epct.createdBy.lastName}</td>
					<td>${epct.createdDate}</td>
				</tr>
			</form>
		</c:forEach>
	</table>




	<p />



	<p />
	&nbsp;
	<p />
	<a href="/p3sharness/listepcts">Refresh</a>
	<p />
	<a href="/p3sharness/listtxns">Back to Top page</a>
	<p />
	<a href="/p3sharness/logout">logout</a>
	<p />
	&nbsp;
	<p />



</body>

</html>
