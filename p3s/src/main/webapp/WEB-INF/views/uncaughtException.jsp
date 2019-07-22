<!doctype html>
<html lang="en">
<head>
	<title>ac uncaught exception</title>
	<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
	<%@ taglib uri = "http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
	
	<link rel="stylesheet" type="text/css" href="styles/normalize.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="styles/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	
</head>

<body>

	<c:if test="${not empty error}">
		<font color="red">
	   		Error: ${error}
	   	</font>
	</c:if>

This page may be shown if an error occurs.
If a stack-dump is displayed below, the first part of it may be useful to the BackEnd development team, to understand the cause of the error.
<br/>
Thus far, such errors are mostly caused by out-of-date data in the database.
<p/>
[deliberate typo: experimet]
<br/>
<pre>
..vax.servlet.ServletException: File [/WEB-INF/views/uncaughtException.jsp] not found
</pre>







  <spring:message var="title" code="error_uncaughtexception_title" htmlEscape="false" />
  <util:panel id="title" title="${title}">
    <h2>${fn:escapeXml(title)}</h2>
    <p>
      <spring:message code="error_uncaughtexception_problemdescription" />
    </p>
    <c:if test="${not empty exception}">
      <p>
        <h4>
          <spring:message code="exception_details" />
        </h4>
        <spring:message var="message" code="exception_message" htmlEscape="false" />
        <util:panel id="_message" title="${message}" openPane="false">
          <c:out value="${exception.localizedMessage}" />
        </util:panel>
        <spring:message var="stacktrace" code="exception_stacktrace" htmlEscape="false" />
        <util:panel id="_exception" title="${stacktrace}" openPane="false">
          <c:forEach items="${exception.stackTrace}" var="trace">
            <c:out value="${trace}" />
            <br />
          </c:forEach>
        </util:panel>
      </p>
    </c:if>
  </util:panel>

</body>
</html>
