package com.bcs.p3s.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bcs.p3s.service.PdfUploadServiceImpl;
import com.bcs.p3s.service.model.FileUploadForm1200PdfData;

// Note re max uploadable filesize. Whilst the below constraints have effect, beyond 4MB there is a separate constraint:
//   Packet for query is too large (47452426 > 4194304). You can change this value on the server by setting the max_allowed_packet' variable.



@WebServlet("/PdfUploadServlet")
@MultipartConfig(fileSizeThreshold=1024*1024*2, // 2MB
             maxFileSize=1024*1024*5,      // 5MB  // see note above
             maxRequestSize=1024*1024*50)   // 50MB
public class PdfUploadServlet extends HttpServlet {


	private static final long serialVersionUID = 1L;

	
    protected void doPost(HttpServletRequest request,  HttpServletResponse response) throws ServletException, IOException {

    	System.out.println("PdfUploadServlet doPost() starting");

    	PdfUploadServiceImpl pdfUploadServiceImpl = new PdfUploadServiceImpl();
    	FileUploadForm1200PdfData fileUploadForm1200PdfData = pdfUploadServiceImpl.uploadAndProcessForm1200Pdf(request, response);

    	
    	
    	
    	
    	
    	
    	
    	
    	
//    	response.setContentType("text/html;charset=UTF-8");  // Inherited. Desirable?
 
//        final Part filePart = request.getPart("file");
//        String bookId = request.getParameter("bookId");
//        System.out.println("ACdebug1:  bookId="+bookId);
//        
////      String epctId = (String) request.getAttribute("epctid");
////      System.out.println("ACdebug2:  epctid="+epctId);
//      String epctId = request.getParameter("epctid");
//      System.out.println("ACdebug2:  epctid="+epctId);
//        
//        InputStream pdfFileBytes = null;
//        final PrintWriter writer = response.getWriter();
// 
//        try {
// 
//          if (!filePart.getContentType().equals("application/pdf"))
//            {
//                       writer.println("<br/> Invalid File");
//                       return;
//            }
// 
//          //else if (filePart.getSize()>1048576 ) { //2mb
//          else if (filePart.getSize()>52428800 ) { // 50M
//               {
//              writer.println("<br/> File size too big");
//              return;
//               }
//           }
// 
//            pdfFileBytes = filePart.getInputStream();  // to get the body of the request as binary data
// 
//            final byte[] bytes = new byte[pdfFileBytes.available()];
//             pdfFileBytes.read(bytes);  //Storing the binary data in bytes array.
//
//             
//       		Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
//      		Form1200 form1200 = new Form1200();
//      		form1200.setPdfBlob(blob);
//      		form1200.setCreatedDate(new Date());
//      		form1200.persist();
//
//
//             
//             
//             
//             
////            Connection  con=null;
////             Statement stmt=null;
// 
// 
//                 writer.println("<br/> Book Successfully Stored");
// 
//        } catch (FileNotFoundException fnf) {
//            writer.println("You  did not specify a file to upload");
//            writer.println("<br/> ERROR: " + fnf.getMessage());
// 
//        } catch (SQLException e) {
//            // TODO Auto-generated catch block
//            System.out.println("ACdebug:  sqlexceptipn ");
//            e.printStackTrace();
//        } finally {
// 
//            if (pdfFileBytes != null) {
//                pdfFileBytes.close();
//            }
//            if (writer != null) {
//                writer.close();
//            }
//        }
//
//        
//        

//    	request.setAttribute("uploadresult", "Success"  );
//		request.setAttribute("dashboard", "/p3sharness/listtxns");
		
			
//zaphod
		
		// Prepare for next page
		//String url = fileUploadForm1200PdfData.getResultPageUrl();
//		request.setAttribute("uploadresult", fileUploadForm1200PdfData.isUploadOk() ? "Success" : "Fail" );
		//request.setAttribute("dashboard", fileUploadForm1200PdfData.getDashboardUrl());
//		request.setAttribute("dashboard", "/p3sharness/listtxns");
		
		// If below line throws exception - let it fail
//	    getServletContext().getRequestDispatcher(url).forward(request, response);
		


    	//response.setContentType("text/html;charset=UTF-8");  // Inherited. Desirable?
    	String url = "/p3sharness/dun?returnto=listepcts";
    	response.sendRedirect(url);

		
//		// Prepare for next page
//		String url = fileUploadForm1200PdfData.getResultPageUrl();
//		request.setAttribute("uploadresult", fileUploadForm1200PdfData.isUploadOk() ? "Success" : "Fail" );
//		request.setAttribute("dashboard", fileUploadForm1200PdfData.getDashboardUrl());
//		
//		// If below line throws exception - let it fail
//	    getServletContext().getRequestDispatcher(url).forward(request, response);

		
    }
}
