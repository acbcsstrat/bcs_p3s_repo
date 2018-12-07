package com.bcs.p3s.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Blob;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200;
import com.bcs.p3s.service.model.FileUploadForm1200PdfData;
import com.bcs.p3s.util.lang.Universal;

public class PdfUploadServiceImpl extends Universal implements PdfUploadService {

	
	/**
	 * Upload PDF store to db, in table Form1200
	 * @return FileUploadForm1200PdfData - contains the url for next page, and success/fail indicator
	 */
	public FileUploadForm1200PdfData uploadAndProcessForm1200Pdf(HttpServletRequest request,  HttpServletResponse response) 
			//	throws ServletException, IOException, P3SException
	{
		String err = CLASSNAME+"uploadAndProcessForm1200Pdf : ";
		log().debug(err+" invoked");
		
		//String bookId = request.getParameter("bookId");
		//System.out.println("ACdebug1:  bookId="+bookId);

		FileUploadForm1200PdfData fileUploadForm1200PdfData = new FileUploadForm1200PdfData();
		String strEpctId = request.getParameter("epctid");
		long lngEpctId = Long.valueOf(strEpctId);
		fileUploadForm1200PdfData.setEpctId(lngEpctId); 
		log().debug("extracted epctId of "+lngEpctId+"   from "+err);
		Epct epct = null;
		if (lngEpctId<1) {
			fail("PDF upload failed to extract valid EpctId - so NOT persisted pdf  :  from "+err);
		} else epct = Epct.findEpct(lngEpctId);

		if (epct==null) {
			fail("PDF upload given EpctId "+lngEpctId+" but no such Epct found.  :  from "+err);
		}
		else if (epct.getForm1200() != null) {
			fail("PDF upload given EpctId "+lngEpctId+" Which already has a Form1200 !  :  from "+err);
		}


		InputStream pdfFileBytes = null;
//		PrintWriter writer = null;
		try {

//			writer = response.getWriter();
	        final Part filePart = request.getPart("file");

			if (!filePart.getContentType().equals("application/pdf"))
			{
				fail("PDF upload failed : Invalid File  :  from "+err);
			}
			else if (filePart.getSize()>52428800 )  // 50M
			{
				fail("PDF file impossibly big (50M+!)   :  from "+err);
			}
			
			pdfFileBytes = filePart.getInputStream();  // to get the body of the request as binary data
			final byte[] bytes = new byte[pdfFileBytes.available()];
			pdfFileBytes.read(bytes);  //Storing the binary data in bytes array.
			   
			Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
			Form1200 form1200 = new Form1200();
			form1200.setPdfBlob(blob);
			form1200.setCreatedDate(new Date());
			form1200.persist();

			epct.setForm1200(form1200);
			epct.merge();
			
			fileUploadForm1200PdfData.setUploadOk(true);
			

			log().debug("Form1200 PDF ("+""+") successfully uploaded and persisted to dB :   from "+err);

		} catch (FileNotFoundException fnf) {
			fail("PDF upload : specified file not accessible. ["+fnf.getMessage()+"]   :  from "+err, fnf);
		} catch (Exception ex) {
			fail("PDF upload : Some other IOException. ["+ex.getMessage()+"]   :  from "+err, ex); // SQLException IOException ServletException
		} 
		finally {
			try {
				if (pdfFileBytes != null) pdfFileBytes.close();
//				if (writer != null) writer.close();
			} catch (IOException io) { ; } // swallow
		}

		return fileUploadForm1200PdfData;
	}

// get fileNAME
	
//    protected void doPost(HttpServletRequest request,  HttpServletResponse response)       throws ServletException, IOException {
//        response.setContentType("text/html;charset=UTF-8");
//        System.out.println("PdfUploadServlet doPost() starting");
// 
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
//		request.setAttribute("uploadresult", "Success"  );
//		request.setAttribute("dashboard", "/p3sharness/listtxns");
//    }

    
}
