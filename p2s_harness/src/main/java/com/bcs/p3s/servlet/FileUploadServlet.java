package com.bcs.p3s.servlet;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.bcs.p3s.model.Form1200;


//@ W ebServlet("/app/UploadServlet")

@WebServlet("/FileUploadServlet")
@MultipartConfig(fileSizeThreshold=1024*1024*2, // 2MB
             maxFileSize=1024*1024*50,      // 50MB
             maxRequestSize=1024*1024*50)   // 50MB
public class FileUploadServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	
    protected void doPost(HttpServletRequest request,  HttpServletResponse response)       throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
		System.out.println("FileUploadServlet doPost() starting");
 
        final Part filePart = request.getPart("file");
        String bookId = request.getParameter("bookId");
        System.out.println("ACdebug:  bookId="+bookId);
        
        InputStream pdfFileBytes = null;
        final PrintWriter writer = response.getWriter();
 
        try {
 
          if (!filePart.getContentType().equals("application/pdf"))
            {
                       writer.println("<br/> Invalid File");
                       return;
            }
 
          //else if (filePart.getSize()>1048576 ) { //2mb
          else if (filePart.getSize()>52428800 ) { // 50M
               {
              writer.println("<br/> File size too big");
              return;
               }
           }
 
            pdfFileBytes = filePart.getInputStream();  // to get the body of the request as binary data
 
            final byte[] bytes = new byte[pdfFileBytes.available()];
             pdfFileBytes.read(bytes);  //Storing the binary data in bytes array.

             
       		Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
      		Form1200 form1200 = new Form1200();
      		form1200.setPdfBlob(blob);
      		form1200.setCreatedDate(new Date());
      		form1200.persist();


             
             
             
             
            Connection  con=null;
             Statement stmt=null;
 
//               try {
//                     Class.forName("com.mysql.jdbc.Driver");
//                     con = DriverManager.getConnection("jdbc:mysql://localhost:3306/p3s_v2","p3sv2_user","212121");
//                  } catch (Exception e) {
//                        System.out.println(e);
//                        System.exit(0);
//                              }
// 
//              try {
//                  stmt = con.createStatement();
//                  //to create table with blob field (One time only)
//                  //stmt.executeUpdate("CREATE TABLE Book (BookId varchar (10) not null , BookContent MEDIUMBLOB, Primary key (BookId))");
// 
//              } catch (Exception e) {
//                        System.out.println("Tables already created, skipping table creation process");
//                  }
// 
//                int success=0;
//
//                PreparedStatement pstmt = con.prepareStatement(
//                		"INSERT INTO Form1200 (created_date, pdf_blob, version) VALUES(?,?,?)");
//                pstmt.setDate(1, new java.sql.Date(new java.util.Date().getTime()));
//                pstmt.setBytes(2,bytes);    //Storing binary data in blob field.
//                pstmt.setInt(3,3);
//
//                
//                
//                
//                success = pstmt.executeUpdate();
//                if(success>=1)  System.out.println("Book Stored");
//                 con.close(); 
 
                 writer.println("<br/> Book Successfully Stored");
 
        } catch (FileNotFoundException fnf) {
            writer.println("You  did not specify a file to upload");
            writer.println("<br/> ERROR: " + fnf.getMessage());
 
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            System.out.println("ACdebug:  sqlexceptipn ");
            e.printStackTrace();
        } finally {
 
            if (pdfFileBytes != null) {
                pdfFileBytes.close();
            }
            if (writer != null) {
                writer.close();
            }
        }

        
        
		request.setAttribute("uploadresult", "Success"  );
		request.setAttribute("dashboard", "/p3sharness/listtxns");
    }

	

//works! 181206 1622
//protected void doPost(HttpServletRequest request,  HttpServletResponse response)       throws ServletException, IOException {
//    response.setContentType("text/html;charset=UTF-8");
//	System.out.println("FileUploadServlet doPost() starting");
//
//    final Part filePart = request.getPart("file");
//    String bookId = request.getParameter("bookId");
//
//    InputStream pdfFileBytes = null;
//    final PrintWriter writer = response.getWriter();
//
//    try {
//
//      if (!filePart.getContentType().equals("application/pdf"))
//        {
//                   writer.println("<br/> Invalid File");
//                   return;
//        }
//
//       else if (filePart.getSize()>1048576 ) { //2mb
//           {
//          writer.println("<br/> File size too big");
//          return;
//           }
//       }
//
//        pdfFileBytes = filePart.getInputStream();  // to get the body of the request as binary data
//
//        final byte[] bytes = new byte[pdfFileBytes.available()];
//         pdfFileBytes.read(bytes);  //Storing the binary data in bytes array.
//
//        Connection  con=null;
//         Statement stmt=null;
//
//           try {
//                 Class.forName("com.mysql.jdbc.Driver");
//                 con = DriverManager.getConnection("jdbc:mysql://localhost:3306/p3s_v2","p3sv2_user","212121");
//              } catch (Exception e) {
//                    System.out.println(e);
//                    System.exit(0);
//                          }
//
//          try {
//              stmt = con.createStatement();
//              //to create table with blob field (One time only)
//              //stmt.executeUpdate("CREATE TABLE Book (BookId varchar (10) not null , BookContent MEDIUMBLOB, Primary key (BookId))");
//
//          } catch (Exception e) {
//                    System.out.println("Tables already created, skipping table creation process");
//              }
//
//            int success=0;
//
////            PreparedStatement pstmt = con.prepareStatement("INSERT INTO Book VALUES(?,?)");
////            pstmt.setString(1, bookId);
////            pstmt.setBytes(2,bytes);    //Storing binary data in blob field.
//
//            
//            PreparedStatement pstmt = con.prepareStatement(
//            		"INSERT INTO Form1200 (created_date, pdf_blob, version) VALUES(?,?,?)");
//            pstmt.setDate(1, new java.sql.Date(new java.util.Date().getTime()));
//            pstmt.setBytes(2,bytes);    //Storing binary data in blob field.
//            pstmt.setInt(3,3);
//
//            
//            
//            
//            success = pstmt.executeUpdate();
//            if(success>=1)  System.out.println("Book Stored");
//             con.close(); 
//
//             writer.println("<br/> Book Successfully Stored");
//
//    } catch (FileNotFoundException fnf) {
//        writer.println("You  did not specify a file to upload");
//        writer.println("<br/> ERROR: " + fnf.getMessage());
//
//    } catch (SQLException e) {
//        // TODO Auto-generated catch block
//        e.printStackTrace();
//    } finally {
//
//        if (pdfFileBytes != null) {
//            pdfFileBytes.close();
//        }
//        if (writer != null) {
//            writer.close();
//        }
//    }
//
//}


	
	
	
	
//	/**
//	 * handles Form1200Pdf file upload
//	 */
//	//protected void doPost(HttpServletRequest request, long epctid, HttpServletResponse response) throws IOException, ServletException 
//	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException 
//	{
//	
//		System.out.println("FileUploadServlet doPost() starting - epctid = "+"epctid");
////		String strEpctId = request.getParameter("epctid");
////		System.out.println("FileUploadServlet doPost has got epctid STRING param = "+strEpctId);
//		
//		
//		FileUploadService fileUploadService = new FileUploadServiceImpl();
//		FileUploadForm1200PdfData fileUploadForm1200PdfData = fileUploadService.uploadAndProcessForm1200Pdf(request);
//		
//		// Prepare for next page
//		String url = fileUploadForm1200PdfData.getResultPageUrl();
//		request.setAttribute("uploadresult", fileUploadForm1200PdfData.isUploadOk() ? "Success" : "Fail" );
//		request.setAttribute("dashboard", fileUploadForm1200PdfData.getDashboardUrl());
//		
//		// If below line throws exception - let it fail
//	    getServletContext().getRequestDispatcher(url).forward(request, response);
//	}
//
}
