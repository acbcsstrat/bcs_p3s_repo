package com.bcs.p3s.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bcs.p3s.service.FileUploadService;
import com.bcs.p3s.service.FileUploadServiceImpl;
import com.bcs.p3s.service.model.FileUploadAvatarData;


//@ W ebServlet("/app/UploadServlet")

@WebServlet("/FileUploadServlet")
@MultipartConfig(fileSizeThreshold=1024*1024*2, // 2MB
             maxFileSize=1024*1024*10,      // 10MB
             maxRequestSize=1024*1024*50)   // 50MB
public class FileUploadServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	/**
	 * handles Avatar file upload
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException 
	{
	
		System.out.println("FileUploadServlet doPost() starting");
		
		FileUploadService fileUploadService = new FileUploadServiceImpl();
		FileUploadAvatarData fileUploadAvatarData = fileUploadService.uploadAndProcessAvatar(request);
		
		// Prepare for next page
		String url = fileUploadAvatarData.getResultPageUrl();
		request.setAttribute("uploadresult", fileUploadAvatarData.isUploadOk() ? "Success" : "Fail" );
		request.setAttribute("dashboard", fileUploadAvatarData.getDashboardUrl());
		
		// If below line throws exception - let it fail
	    getServletContext().getRequestDispatcher(url).forward(request, response);
	}

}

