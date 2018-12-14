<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html lang="en">

	<head>
		<title>P3S Harness</title>
	</head>

	<body ng-app="myApp" class="bg-light-grey">
		
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		<div align="center" >
			<h1>Done</h1>
		</div>

<p/>
<!-- 
Raspberry = ${returnto}
 -->
 
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		&nbsp;
		<p/>
		<c:if test = "${returnto != null}">
		Return to :
			 <c:if test = "${returnto == 'listepcts'}">
				<a href="/p3sharness/listepcts">Euro-PCTs</a> (Pre Commit)
			</c:if>
		<p/>
		</c:if>
		<c:if test = "${TxnRef != null}">
		To view Products for Txn ${TxnRef} (2nd menu) - click <a href="/p3sharness/listtxnproducts?p3sref=${TxnRef} }">here</a>
		<p/>
		</c:if>
		To view Transactions (Top menu) - click <a href="/p3sharness/listtxns">here</a>
		<p/>
		<a href="http://localhost:8080/p3sharness/logout">logout</a>

	</body>
	
</html>