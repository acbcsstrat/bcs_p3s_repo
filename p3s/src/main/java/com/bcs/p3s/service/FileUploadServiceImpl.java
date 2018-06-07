package com.bcs.p3s.service;



// ACTODO - replace: System.out.println



import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.model.FileUploadAvatarData;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.Universal;



public class FileUploadServiceImpl extends Universal implements FileUploadService {

	protected String PREFIX = this.getClass().getName() + " : "; 

	public FileUploadAvatarData uploadAndProcessAvatar(HttpServletRequest request) {

		log().debug(PREFIX+"  uploadAndProcessAvatar() invoked");
		FileUploadAvatarData data = new FileUploadAvatarData();
		data.setResultPageUrl("/"); // failsafe
		
		
		try {
			
			populateFromProperties(data);
			
			uploadAvatar(data, request);
			
			resizeAvatar(data);
	
			persistAvatarToDb(data);

			
			data.setUploadOk(true);

		} catch ( Exception e ) {
			// Root cause of any exception should NOT have already have been logged.
			// So upon exception here: set FileUploadAvatarData accordingly; log; continue (if possible) 
			logErrorAndContinue(PREFIX+" uploadAndProcessAvatar() subcall suffered exception.", e);
				// known incoming exceptions : P3SPropertyException, IOException, ServletException, SQLException  
		}

		log().debug(PREFIX+"  uploadAndProcessAvatar() completed. statusOK="+data.isUploadOk());
		return data;
	}

	

	// Start of main methods
	
	protected void populateFromProperties(FileUploadAvatarData data) throws P3SPropertyException 
	{
		log().debug(PREFIX+" populateFromProperties() invoked");
	
		P3SPropertyReader reader = new P3SPropertyReader();

		String resultUrl = reader.getGenericProperty(P3SPropertyNames.UPLOAD_RESULT_URL); 
		data.setResultPageUrl(resultUrl);

		String dashboardUrl = reader.getESProperty(P3SPropertyNames.P3S_WEB_TOMCAT_URL_BASE); 
		data.setDashboardUrl(dashboardUrl);

		log().debug(PREFIX+" populateFromProperties() sets resultUrl, dashboardUrl to : "+resultUrl+", "+dashboardUrl);
	}
	
	
	
	protected void uploadAvatar(FileUploadAvatarData data, HttpServletRequest request) 
													throws IOException, ServletException
	{
		log().debug(PREFIX+" uploadAvatar() invoked");
		
		int ptrSoFar = 0;
        //byte[] xbigBuff = new byte[1024000]; // 100kB
		
	    // log().debug("Prior to Parts loop");  
	    for (Part part : request.getParts()) {

	    	// log().debug("Uploading avatar: Inside top of loop for n Parts");
	        String fileName = extractFileName(part);
	        data.setFilename(fileName);
	        //log().debug(" Name of uploaded file (for this Part) is : "+fileName);
	        
	        // below: check that filename doesn't change in different 'Part's (Not that we've ever seen >1 part)
			//if ( isEmpty(fileName) ) throw new P3SException(PREFIX+" filename from part is Empty : "+fileName);
			//if (data.getFilename() == null) { 
			//	data.setFilename(fileName);
			//} else {
			//	if ( ! data.getFilename().equals(fileName)) {
			//		throw new P3SException(PREFIX+" filename differs in parts: "+data.getFilename()+" : "+fileName);
			//	}
			//}
	        
	        long partSize = part.getSize();
	        int iPartSize = Math.toIntExact(partSize);		        
	        log().debug(" Name of uploaded file (for this Part) is : "+fileName+"   Size of this PART is "+partSize );
	        
	        //InputStream thisPartIS = part.getInputStream();
	        //byte[] thisPartBytes = thisPartIS.readAllBytes(); - needs java9
	        InputStream is = part.getInputStream();
	        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
	        int nRead;
	        // log().debug("MAX Size of this PART is "+data.getRawImage().length );
	        while ((nRead = is.read(data.getRawImage(), ptrSoFar, data.getRawImage().length)) != -1) {
	            buffer.write(data.getRawImage(), ptrSoFar, nRead);
	            // log().debug(" in INNER readUploadedFile loop - just read "+nRead+" chars");
	        }
	     
	        buffer.flush();
	        //byte[] byteArray = buffer.toByteArray();

	    
	        ptrSoFar += iPartSize;
	    
	    
	        log().debug("just pre end-of-Parts LOOP : ptrSoFar, iPartSize are= "+ptrSoFar+", "+ iPartSize);
		    
		    
	    }
	    //log().debug("after 'Part's loop");

		log().debug(PREFIX+"uploadAvatar completed.");
	}
	
	
	
	/**
	 * Credit to : https://www.mkyong.com/java/how-to-resize-an-image-in-java/  
	 */
	protected void resizeAvatar(FileUploadAvatarData data) throws IOException {
		log().debug(PREFIX+" resizeAvatar() invoked");
		InputStream in = new ByteArrayInputStream(data.getRawImage());
		BufferedImage originalImage = ImageIO.read(in);
		
		int type = originalImage.getType() == 0? BufferedImage.TYPE_INT_ARGB : originalImage.getType();
		// log().debug("orig type = "+type);
			
		BufferedImage resizeImageJpg = resizeImage(originalImage, type);

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ImageIO.write( resizeImageJpg, "jpg", baos );
		baos.flush();
		data.setResizedImage(baos.toByteArray());
		baos.close();

		log().debug(PREFIX+"resizeAvatar() : resized image size is "+ baos.toByteArray().length 
				+ "  for source image called "+data.getFilename()+"  of type = "+type);
	}
	
	
	
	protected void persistAvatarToDb(FileUploadAvatarData data) throws SQLException {
		log().debug(PREFIX+" persistAvatarToDb() invoked");
		
		byte[] bites = data.getResizedImage();
		//writeImageToDb(bites);

		
		
  		P3SUser myUser = SecurityUtil.getMyUser();

  		Blob blob = new javax.sql.rowset.serial.SerialBlob(bites);

  		myUser.setAvatar(blob);
  		myUser.merge();
		
      		
	}
	

	// Start of support methods
	
	/**
	 * Extracts file name from HTTP header content-disposition
	 */
	protected String extractFileName(Part part) {
	    String contentDisp = part.getHeader("content-disposition");
	    String[] items = contentDisp.split(";");
	    for (String s : items) {
	        if (s.trim().startsWith("filename")) {
	            return s.substring(s.indexOf("=") + 2, s.length()-1);
	        }
	    }
	    return null;
	}

	protected BufferedImage resizeImage(BufferedImage originalImage, int type){
		BufferedImage resizedImage = new BufferedImage(AVATAR_IMG_WIDTH, AVATAR_IMG_HEIGHT, type);
		Graphics2D g = resizedImage.createGraphics();
		g.drawImage(originalImage, 0, 0, AVATAR_IMG_WIDTH, AVATAR_IMG_HEIGHT, null);
		g.dispose();
		return resizedImage;
    }

//	protected void writeImageToDb(byte[] stream) throws SQLException
//	{
//		System.out.println("writeImageToDb invoked");
//		
////		Connection conn = null;
////		String connectionURL = "jdbc:mysql://localhost:3306/avatar_images";
//		
////		try {
//
//			
//      		P3SUser myUser = SecurityUtil.getMyUser();
//
//      		Blob blob = new javax.sql.rowset.serial.SerialBlob(stream);
//
//      		myUser.setAvatar(blob);
//      		myUser.merge();
//		
////		}
////		//catch (SQLException | ReflectiveOperationException e) {
////		catch (SQLException e) {
////			System.out.println("Exception thrown whilst writing image to dB : ");
////			e.printStackTrace();
////			throw new Exception("Exception thrown whilst writing image to dB : ", e);
////		}
//		
////		finally{
//////			try {
//////				if (conn!=null) conn.close();
//////			} catch (SQLException e) {
//////				System.out.println("exception during db finally conn.close");
//////				e.printStackTrace();
//////			}
////		}
//	}

}
