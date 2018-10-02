<html>
<head>
	<title>ac uncaught exception</title>
</head>

<body>
This file is uncaughtException.jsp
<br/>
Note: *.jsp    NOT *.jspx
<p/>
This file should NEVER be seen on-screen
<p/>
It OUGHT never be encountered anywhere.
<br/>
However, whilst an unhandled exception in a controller <i>should</i> invoke uncaughtException.jsp<b>x</b>
<br/>
it instead seems to invoke this. So the json data message received by the FE may contain this.
<p/>
AC 02/10/2018
</body>
</html>
