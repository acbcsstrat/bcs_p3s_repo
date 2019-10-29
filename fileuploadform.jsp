<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <title>File Upload</title>

  <%
	//	For Avatar uploads, supports:
	//	- File size to 10MB (unverified)
	// 	- png jpg jpeg gif bmp
  %>


</head>
<body>
  <center>
    <h1>File Upload</h1>
    <form method="post" action="FileUploadServlet" enctype="multipart/form-data">
        Select file to upload: 
        <input type="file" name="file" size="60" accept=".jpg,.jpeg,.bmp,.gif,.png" /><br/>
        <br /> <input type="submit" value="Upload" />
    </form>
  </center>


<p/>
Avatar2
    <h1>File Upload</h1>
    <form method="post" action="/p3sweb/avatar2/" enctype="multipart/form-data">
        Select file to upload: 
        <input type="file" name="file" size="60" accept=".jpg,.jpeg,.bmp,.gif,.png" /><br/>
        <br /> <input type="submit" value="Upload" />
    </form>
<p/>
Avatar3
    <h1>File Upload</h1>
    <form method="post" action="/p3sweb/avatar3/" enctype="multipart/form-data">
        Select file to upload: 
        <input type="file" name="file" size="60" accept=".jpg,.jpeg,.bmp,.gif,.png" /><br/>
        <br /> <input type="submit" value="Upload" />
    </form>
<p/>
Avatar3
    <h1>File Upload</h1>
    <form method="post" action="/p3sweb/avatar23/" >
        NO Select NEEDED 
        <br /> <input type="submit" value="Test" />
    </form>


</body>
</html>
