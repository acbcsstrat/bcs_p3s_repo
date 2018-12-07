package com.bcs.p3s.service;

import javax.servlet.http.HttpServletRequest;

import com.bcs.p3s.service.model.FileUploadAvatarData;
import com.bcs.p3s.service.model.FileUploadForm1200PdfData;

/**
 * Service for file uploads
 * Initially for avatar (aka Mugshot aka UserProfile image)
 * expect upload customer PDFs later
 * 
 *  For avatars, will upload, resize, and store in database
 */
public interface FileUploadService {

	/**
	 * Upload image, resize & store to db, in table P3SUser
	 * @return FileUploadForm1200PdfData - contains the url for next page, and success/fail indicator
	 */
	//public FileUploadAvatarData uploadAndProcessAvatar(HttpServletRequest request);
	public FileUploadForm1200PdfData uploadAndProcessForm1200Pdf(HttpServletRequest request);

	public static final int AVATAR_IMG_WIDTH = 100;
	public static final int AVATAR_IMG_HEIGHT = 100;

}
