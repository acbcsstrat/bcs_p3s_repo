<html>
<head>
<title>P3S Login</title>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
</head>
<body>
   <h1>Login</h1>
   <spring:url value="/resources/j_spring_security_check" var="form_url" />
   <form name='f' action="<c:url value='/resources/j_spring_security_check' />" method='POST'>
      <table>
         <tr>
            <td>User:</td>
            <td><input type='text' name='j_username' value=''></td>
         </tr>
         <tr>
            <td>Password:</td>
            <td><input type='password' name='j_password' /></td>
         </tr>
         <tr>
            <td><input name="submit" type="submit" value="submit" /></td>
         </tr>
      </table>
  </form>
</body>
</html>