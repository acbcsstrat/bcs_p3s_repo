<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
  <title>File Upload</title>


</head>
<body>
  <center>
    <h1>File Upload</h1>
    <form method="POST" action="http://localhost:8080/p3sweb/rest-upload-file/" enctype="multipart/form-data">
    <table>
        <tr>
            <td><label >Select a file to upload</label></td>
            <td><input type="file" name="germanTranslation" /></td>
        </tr>
        
        <tr>
            <td><label >Select a file to upload</label></td>
            <td><input type="file" name="frenchTranslation" /></td>
        </tr>
        <tr>
            <td><input type="submit" value="Submit" /></td>
        </tr>
    </table>
</form>
</center>
</body>
</html>
