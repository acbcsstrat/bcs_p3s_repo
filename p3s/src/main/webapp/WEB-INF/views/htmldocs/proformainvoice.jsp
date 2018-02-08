<html>
<head>

	<title>PatentPlace ProForma Invoice</title>
	<%@taglib prefix="suncore" uri="http://java.sun.com/jsp/jstl/core"%>

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
            pdf.save('proforma.pdf');
    }); 
    }
    
</script>
</head>

<style>
	#content{
	    	background-color:#FFFFFF;
	    }
</style>

<body>

<%@ page import = "java.util.List"%>
<%@ page import = "com.bcs.p3s.docs.htmldoc.model.ProformaInvoice"%>
<%@ page import = "com.bcs.p3s.docs.htmldoc.model.Patent4htmlDoc"%>
<%
ProformaInvoice data = (ProformaInvoice) request.getAttribute("proformaInvoice");
List<Patent4htmlDoc> patents = (List<Patent4htmlDoc>) data.getPatents(); 
%>


<div id="content">
<table border="0" width="100%" >
<tr>
  <td>
  <!-- Top Header -->
  <table border="0" width="100%">
    <tr>
      <td width="50%">
        <img src="/p3sweb/public/images/logo-withname-4htmldoc.png">
      </td>
	  <td>
	  </td>
	  <td width="50%" align="left">
	    <h1>PRO-FORMA INVOICE</h1>
	  </td>
	  <td>
	  </td>
    </tr>
  </table>
  </td>
</tr>
<tr>
  <td>
  <!-- Address bar -->
  <table border="0" width="100%">
    <tr>
      <td width="33%" valign="top">
        <b>PATENT PLACE</b>
        <br/>25 Meer Street
        <br/>Stratford-upon-Avon
        <br/>Warwickshire
        <br/>CV37 6QB
        <br/>United Kingdom
        <br/><a href="www.thepatent.place">www.thepatent.place</a>
      </td>
      <td width="33%" valign="top">
        <b>BILL TO:</b>
        <br/><%=data.getClientAddress().getOrganisation() %>
        <br/><%=data.getClientAddress().getAddressStreet() %>
        <br/><%=data.getClientAddress().getAddressCity() %>
        <br/><%=data.getClientAddress().getAddressUsaState() %>
		<br/><%=data.getClientAddress().getZipcode() %>
        <br/><a href="mailto:<%=data.getClientAddress().getHyperlink()%>"><%=data.getClientAddress().getHyperlink()%></a>
      </td>
      <td width="300" align="left" valign="top">
        <b>DATE:</b> <%=data.getDocDate() %>
        <br/><b>INVOICE NO:</b> <%=data.getInvoiceNumber()%>
        <br/><b>EXCHANGE RATE:</b>
        <br/><%=data.getFxRateUsdPerEur()%> USD = 1 EUR
        <p/>
        <font color="red"><b>IMPORTANT:</b></font>
        <br/>Our service is conditional on funds
        <br/>reaching our account by the due
        <br/>date and time shown below.
      </td>
    </tr>
  </table>
  </td>
</tr>

<tr>
  <td>&nbsp;</td>
</tr>

<tr>
  <!-- References bar -->
  <td>
  <table border="1" width="100%">
    <tr>
      <th align="left">
        <b>ORDERED BY:</b>
      </th>
      <th align="left">
        <b>TRANSACTION TYPE:</b>
      </th>
      <th align="left">
        <b>TRANSACTION ID:</b>
      </th>
      <th align="left">
        <b>DUE DATE &amp; TIME:</b>
      </th>
	</tr>
    <tr>
      <td>
        <%=data.getClientAddress().getPersonName() %>
      </td>
      <td>
        <%=data.getTransactionType()%>
      </td>
      <td>
        <%= data.getTransactionReference()%>
      </td>
      <td>
        <%=data.getMoneyToArriveBy() %>
      </td>
    </tr>
  </table>
</tr>

<tr>
  <td>&nbsp;</td>
</tr>
<tr>
  <td>&nbsp;</td>
</tr>

<tr>
  <td>
  <!-- Repeating Patent details-->
  <table border="0" width="100%">

	<% for (Patent4htmlDoc patent : patents) {  %>

    <tr>
      <td>
	    <!-- Start of a patent - summary row-->
  		<table border="0">
          <tr>
            <td>
              <b>PATENT:</b>
            </td>
            <td>
              <%=patent.getNumberInList()%> of <%=patent.getListSize() %>
            </td>
          </tr>
          <tr>
            <td>
              <b>APPLICATION NO:</b>
            </td>
            <td>
              <%=patent.getApplicationNumber() %>
            </td>
          </tr>
          <tr>
            <td>
              <b>YOUR CLIENT REF:</b>
            </td>
            <td>
              <%=patent.getClientRef() %>
            </td>
          </tr>
          <tr>
            <td>
              <b>FILING DATE:</b>
            </td>
            <td>
              <%=patent.getFilingDate() %>
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td>
              <b>FEES</b>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <tr>
      <td>
	    <!-- Start of a patent - Cost breakdown-->
  		<table border=1  width="100%">
          <tr>
            <td  width="80%">
              Official Fee
            </td>
            <td width="20%" align="right">
              $<%=patent.getOfficialRenewalFeeUsd() %>
            </td>
          </tr>
          <tr>
            <td>
              EPO Extension Fee
            </td>
            <td align="right">
              $<%=patent.getOfficialExtensionFeeUsd() %>
            </td>
          </tr>
          <tr>
            <td>
              Processing Fee
            </td>
            <td align="right">
              $<%=patent.getProcessingFeeUsd() %>
            </td>
          </tr>
          <tr>
            <td>
              Express Clearance Fee
            </td>
            <td align="right">
              $<%=patent.getExpressClearanceFeeUsd() %>
            </td>
          </tr>
          <tr>
            <td>
              Urgent Clearance Fee
            </td>
            <td align="right">
              $<%=patent.getUrgentClearanceFeeUsd() %>
            </td>
          </tr>
          <tr>
            <td align="right">
              Total for Patent
            </td>
            <td align="right">
              <b>$<%=patent.getTotalFeeForPatentUsd() %></b>
            </td>
          </tr>
        </table>
      </td>
    </tr>

	<tr>
	  <td>&nbsp;</td>
	</tr>

	<% }  /* End of : Loop for each PatentRenewal */ %>  


  </table>
  </td>
</tr>


<tr>
  <td>&nbsp;</td>
</tr>

<tr>
  <!-- Grand Total line -->
      <td>
  		<div align="right">TOTAL PAYABLE :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>$<%=data.getTotalUsdPayable() %></b></div>
      </td>
</tr>


<tr>
  <td>&nbsp;</td>
</tr>

<tr>
  <!-- Footer -->
  <table border=0 align="center"  width="100%">
    <tr>
      <td>
        <h1 align="center">NO SERVICES PROVIDED IN THE US</h1>
      </td>
    </tr>
    <tr>
      <td>
        
      </td>
    </tr>
    <tr>
      <td>
        <h2 align="center">PLEASE WIRE YOUR PAYMENT TO EITHER OF:</h2>
      </td>
    </tr>
    <tr>
      <td>
        
      </td>
    </tr>
    <tr>
      <td>

		<!--  The table that holds the 2 sets of payment details -->
        <table align="center" width="60%">  
		  <tr>
		    <td>
		        <table align="center">
		          <tr>
		            <td>
		              <b>For payment via:</b>  
		              
		            </td>
		            <td>
		              <b><%=data.getBankDetails().getAccount1Type().toUpperCase() %></b>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            ABA Number:
		            </td>
		            <td>
		            <%=data.getBankDetails().getAccount1BranchCode() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            Account Number:
		            </td>
		            <td>
		              <%=data.getBankDetails().getAccount1Number() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            Reference:
		            </td>
		            <td>
		              <%=data.getTransactionReference() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            Have 2 spare fields
		            </td>
		            <td>
		              if needed
		            </td>
		          </tr>
		        </table>
		    </td>
		    <td width="20%">
				&nbsp;
		    </td>
		    <td>
		        <table align="center">
		          <tr>
		            <td>
		              <b>For payment via:</b>  
		              
		            </td>
		            <td>
		              <b><%=data.getBankDetails().getAccount2Type().toUpperCase() %></b>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            ABA Number:
		            </td>
		            <td>
		            <%=data.getBankDetails().getAccount2BranchCode() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            Account Number:
		            </td>
		            <td>
		              <%=data.getBankDetails().getAccount2Number() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            Reference:
		            </td>
		            <td>
		              <%=data.getTransactionReference() %>
		            </td>
		          </tr>
		          <tr>
		            <td>
		            &nbsp;
		            </td>
		            <td>
		            &nbsp;
		            </td>
		          </tr>
		        </table>
		    </td>
		  </tr>
        </table>


      </td>
    </tr>
    <tr>
      <td>
        
      </td>
    </tr>
    <tr>
      <td>
        &nbsp;
      </td>
    </tr>
    <tr>
      <td> <font color="blue">
        <div align="center">
          Please ensure you use our Transaction ID as your payment reference.
          <br/>
          Patents cannot be renewed by our service if the Transaction ID is missing or incorrectly quoted.
        </div>
      </font></td>
    </tr>
  </table>

</tr>
</table>
</div>
<div class="btn-no-bg">
	<a href="javascript:demoFromHTML()">Save as PDF</a>
</div>  
</body>
</html>
