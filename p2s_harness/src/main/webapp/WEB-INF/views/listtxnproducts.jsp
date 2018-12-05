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
<!--  AbstractSellableProduct -->
<%@ page import="com.bcs.p3s.model.Patent" %>
<%@ page import="com.bcs.p3s.model.Epct" %>
<%@ page import="com.bcs.p3s.model.Renewal" %>
<%@ page import="com.bcs.p3s.display.TxnProduct" %>

<!--  
< % List<Epct> igs = ( reque st.getParameter("epcts"));  % >
-->


Server time: ${timeStr}
<p/>
&nbsp;
<p/>


<% List<Txn> txn = null; %>
<table border="0">
  <tr colspan="2">
    <td>
  	  <b>Products for:</b>
  	</td>
  </tr>
  <tr>
    <td>
  	  Payment ID:
  	</td>
    <td>
  	  ${txnId}
  	</td>
  </tr>
  <tr>
    <td>
  	  P3S ref:
  	</td>
    <td>
  	  ${txnName}
  	</td>
  </tr>
  <tr>
    <td>
  	  Payment Status:
  	</td>
    <td>
  	  ${txnStatus}
  	</td>
  </tr>
  <tr>
    <td>
  	  Num Renewals:
  	</td>
    <td>
	  ${renewals.size()}  	  
  	</td>
  </tr>
  <tr>
    <td>
  	  Num Epcts:
  	</td>
    <td>
  	  ${epcts.size()}
  	</td>
  </tr>
  <tr>
    <td>
       
  	</td>
    <td>
  	</td>
  </tr>
</table>
<p/>




<table border="1">
    <tr>
		<th>
			Type 
		</th>
		<th>
			Sellable ID 
		</th>
		<th>
			Patent AppNum 
		</th>
		<th>
			Patent ID 
		</th>
		<th>
			Status 
		</th>
		<th>
			Options 
		</th>
		<th>
		   BlobId
		</th>
    </tr>



<c:forEach items="${products}" var="product">
	<form action="changeproductstatus" method="POST" >							
	    <tr>
			<td>
				${product.productType}
			</td>
			<td>
				${product.productId} 
			</td>
			<td>
				${product.patentAppNum} 
			</td>
			<td>
				${product.patentId} 
			</td>
			<td>
				${product.existingStatus} 
			</td>
			<td>
<!-- 
				<c:set var = "salary" scope = "session" value = "${2000*2}"/>
 -->
				<c:if test = "${product.dropdowns != null}">
					<select name="nextstate">
					  ${product.dropdowns}
					</select>
				</c:if>
			</td>
			<td>
				<a href="/p3sharness/form1200PDF?form1200id=${product.blobId}">${product.blobId}</a> 
			</td>
			<td>
				<input type="hidden" name="productType" value="epct" /> 
				<input type="hidden" name="productId" value="${epct.id}" /> 
				<input type="submit" name="Submit" id="sub-${txnName}-${epct.id}" onclick=" this.form.submit(); " /> 
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
<a href="/p3sharness/listtxnproducts?p3sref=${txnName}">Refresh</a>
<p/>
<a href="/p3sharness/listtxns">Back to Top page</a>
<p/>
<a href="/p3sharness/logout">logout</a>
<p/>
&nbsp;
<p/>



</body>

</html>
