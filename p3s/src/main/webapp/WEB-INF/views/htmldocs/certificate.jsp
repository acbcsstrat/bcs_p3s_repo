<html>
<head>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js" integrity="sha384-FzT3vTVGXqf7wRfy8k4BiyzvbNfeYjK+frTVqZeNDFl8woCbF0CYG6g2fMEFFo/i" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.debug.js"></script>
<script>
    function demoFromHTML() {
    	
        var pdf = new jsPDF('p', 'pt', 'A4');
        
        source = $('#content')[0];

        specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypass': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true;
            }
        };
         
        pdf.addHTML(source, function () {
            pdf.save('certificate.pdf');
    }); 
    }
    
</script>
</head>

<style>
	#content{
	    	background-color:#FFFFFF;
	    	font-family: serif;
	    }
	    .heading_address{
	    	text-align: right;
	    }
	  .table_header{
   		border: none;
   		width: 100%;
		}
		
	  .table_content_main{
   		border: 1px solid black;
   		width: 100%;
		}
		
		table, td, th {
    		border: 1px solid black;
		}
		td{
			width: 50%;
		}
		
		table {
		    border-collapse: collapse;
		    width: 100%;
		}
		.link_class {
			color: green;
		}
		
		.watermark {
		    position: relative;
		    width: 100%;
		    #height: 100%; # Inhibit, or ends div partway down the page
		    z-index: 99999;
		    background: url('/p3sweb/public/images/watermark.png') center center no-repeat;
		    pointer-events: none;
		}
	    
	    .footnum table { 
    		border: 0px;
    		margin-top: 50px;
	    }
	    .footnum td { 
    		border: 0px;
	    }
	    
</style>

<body>

<%@ page import = "java.util.List"%>
<%@ page import = "com.bcs.p3s.docs.htmldoc.model.HtmlDocCertificate"%>
<%
HtmlDocCertificate data = (HtmlDocCertificate) request.getAttribute("htmlDocCertificate");
%>

<div id="content" class="watermark">

<!-- Top Header -->

	<div class="table_header">
		<div > <img src="/p3sweb/public/images/logo-withname-4htmldoc.png"> </div>
		
	  	<div class="heading_address" >
	    	<b>PATENT PLACE</b>
        	<br/>25 Meer Street
        	<br/>Stratford-upon-Avon
        	<br/>Warwickshire
        	<br/>CV37 6QB
        	<br/>United Kingdom
        	<br/><a class="link_class" href="www.thepatent.place">www.thepatent.place</a>
	  	</div>
 	 </div>
 
 	<div>
	<div align="center">
		<h1>PATENT RENEWAL CERTIFICATE <br/>for patent renewed at the <%=data.getRenewingOrganisation() %></h1> 
	</div>
	<br/>
	<br/>
	      	
  <!-- Content table -->
  <!-- below onwards replace with DB data later -->
  	<table>
		<tr>
			<td><b>ORGANISATION</b></td>
			<td><%=data.getClientBusinessName() %></td>
		</tr>
		<tr>
			<td><b>APPLICATION NO.</b></td>
			<td><%=data.getPatentApplicationNumber() %></td>
		</tr>
		<tr>
			<td><b>DESCRIPTION</b></td>
			<td><%=data.getPatentTitle() %></td>
		</tr>
		<tr>
			<td><b>SHORT TITLE</b></td>
			<td><%=data.getOurClientsShortTitleForPatent() %></td>
		</tr>
		<tr>
			<td><b>CLIENT REF</b></td>
			<td><%=data.getOurClientsReferenceForTheirClient() %></td>
		</tr>
		<tr>
			<td><b>PUBLICATION NO.</b></td>
			<td><%=data.getPatentPublicationNumber() %>  </td>
		</tr>
		<tr>
			<td><b>APPLICANT NAME</b></td>
			<td><%=data.getPatentApplicantName() %></td>
		</tr>
		<tr>
			<td><b>FILING DATE</b></td>
			<td><%=data.getPatentFilingDate() %></td>
		</tr>
 	</table>
 	
 	<br/>
 	<br/>
 	<br/>
 	<div>The EPO Record shows:</div>
 	<table>
 		<tr>
 			<td><b>PATENT YEAR</b></td>
 			<td><%=data.getEpoPatentYearInPlace() %></td>
 		</tr>
 		<tr>
 			<td><b>RENEWED ON</b></td>
 			<td><%=data.getEpoPatentRenewedOnDate() %></td>
 		</tr>
 	</table>

 	<br/>
 	<br/>
	<div class="footnum">
	 	<p/>
	 	<table >
	 		<tr>
	 			<td><b>Patent Place Certificate Number:</b></td>
	 			<td><%=data.getCertificateNumber() %></td>
	 		</tr>
	 		<tr>
	 			<td><b>Issue Date:</b></td>
	 			<td><%=data.getCertificateIssueDate() %></td>
	 		</tr>
	 	</table>
	</div>


</div>
</div>


<p/>
<div class="btn-no-bg">
	<a href="javascript:demoFromHTML()">Save as PDF</a>
</div>  

</body>
</html>
