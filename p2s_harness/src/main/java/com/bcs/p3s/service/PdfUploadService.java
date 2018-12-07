package com.bcs.p3s.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bcs.p3s.service.model.FileUploadForm1200PdfData;
import com.bcs.p3s.util.lang.P3SException;

public interface PdfUploadService {

	/**
	 * Upload PDF store to db, in table Form1200
	 * @return FileUploadForm1200PdfData - contains the url for next page, and success/fail indicator
	 */
	public FileUploadForm1200PdfData uploadAndProcessForm1200Pdf(HttpServletRequest request,  HttpServletResponse response); 
					//throws ServletException, IOException, P3SException;

}
