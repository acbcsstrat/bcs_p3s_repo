package com.bcs.p3s.controller.web;
import com.bcs.p3s.model.Epct;
import com.bcs.p3s.model.Form1200;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.util.lang.P3SRuntimeException;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.crypto.bcrypt.BCrypt;


@RequestMapping("/p3susers")
@Controller
@RooWebScaffold(path = "p3susers", formBackingObject = P3SUser.class)
public class P3SUserController {

    @RequestMapping(method = RequestMethod.POST, produces = "text/html")
    public String create(@Valid P3SUser p3SUser, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, p3SUser);
            return "p3susers/create";
        }

        System.out.println(" ****   Creating a P3SUser with an Bcrypteded password **************");
    	String password = p3SUser.getPassword();
        String salt =  BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(password,salt); 
        p3SUser.setPassword(hashedPassword);
        System.out.println(" ****   DONE  **************");

        uiModel.asMap().clear();
        p3SUser.persist();
        return "redirect:/p3susers/" + encodeUrlPathSegment(p3SUser.getId().toString(), httpServletRequest);
    }
    

    
    @RequestMapping(method = RequestMethod.PUT, produces = "text/html")
    public String update(@Valid P3SUser p3SUser, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, p3SUser);
            return "p3susers/update";
        }

        System.out.println(" ****   Updating a P3SUser with an Bcrypteded password **************");
    	String password = p3SUser.getPassword();
        String salt =  BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(password,salt); 
        p3SUser.setPassword(hashedPassword);
        System.out.println(" ****   Done **************");

        uiModel.asMap().clear();
        p3SUser.merge();
        return "redirect:/p3susers/" + encodeUrlPathSegment(p3SUser.getId().toString(), httpServletRequest);
    }
    



    //------------------- Provide the Form1200 PDF --------------------------------------------------

    
//    protected final String PREFIX = "P3SUserController";
    
//    
//	/**
//	 * 
//	 * TBC: If pdf not exist, provide the data from the db (zero-length image)
//	 */
//	@RequestMapping(value = "/form1200pdf/", method = RequestMethod.GET)
//	public void provideForm1200Pdf(@RequestParam(value = "form1200id", required = true) Long itemId, 
//			HttpServletResponse response,HttpServletRequest request) throws ServletException, IOException {
//
//		String err = PREFIX+"/avatarImage  ";
//		//log().debug(err + "invoked  : id = "+itemId);
//		System.out.println(err + "invoked  : id = "+itemId);
//		
//
//		byte[] bytearray = new byte[1048576]; // 1MB. Plenty big for 10k resized Avatars
////  		P3SUser myUser = SecurityUtil.getMyUser();
////  		P3SUser selectedUser = null;
//
//  		
//		try {
//
////	  		if (itemId==null) selectedUser = myUser;
////	  		else {
////	  			selectedUser = P3SUser.findP3SUser(itemId);
////	  			if ( (selectedUser==null) || 
////	  			selectedUser.getBusiness().getId() != myUser.getBusiness().getId()) {
////	  					err+= ("user "+myUser.getId()+" asked for invalid userId "+itemId); 
////	  					logM().warn(err); throw new P3SRuntimeException(err+" asked for invalid userId "+itemId);
////	  			}
////	  		}
//
//			Blob blobby = selectedUser.getAvatar_blob();
//
//			if (blobby==null) {
//					log().warn(err+" IS NO AVATAR IN dB FOR ID "+itemId);
//					response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
//					response.getOutputStream().write(bytearray,0,0); 
//			} else {
//				int size=0;
//				InputStream sImage = blobby.getBinaryStream();
//				while( (size=sImage.read(bytearray)) != -1 ) {
//					log().debug(err+" in loop reading avatar. Size this loop is "+size);
//
//					response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
//					response.getOutputStream().write(bytearray,0,size); 
//				}
//			}
//
//			response.getOutputStream().close();
//		    //log().debug(PREFIX+" AFTER loop. size NOW = "+size);
//		}
//		catch(Exception ex) {
//			System.out.println(err+"Error retrieving avatar. Rqst was id "+itemId, ex);
//		}
//	}
//


// 181214 seems THIS is an older redundant devt copy. comment-out THEN DELETE 
   //------------------------------ view form1200 PDF from Blob --------------------------------------------
//   
//	protected final String CLASSNAME = "P3SUserController";
//	
//	@RequestMapping(value = "/form1200Pdf", method = RequestMethod.GET, produces = "application/pdf")
//	public void streamForm1200Pdf(@RequestParam(value = "epctId", required = false) Long epctId, 
//			HttpServletResponse response,HttpServletRequest request) throws ServletException, IOException {
//
//		String err = CLASSNAME+"streamForm1200Pdf() /form1200PDF  ";
//		//log().debug(err + "invoked  : epctId = "+epctId);
//		System.out.println(err + "invoked  : epctId = "+epctId);
//
//		
//		// zaph - TODO HERE - check rqst is Authorised pre providing the data !!
//		
//		
//		byte[] bytearray = new byte[4194304]; // 4MB. = Current size limit
//
//		Blob blobby = null;
//		try {
//			Epct epct = Epct.findEpct(epctId);
//			if (epct != null) {
//				Form1200 form1200 = epct.getForm1200();
//				if (form1200 != null) {
//					blobby = form1200.getPdfBlob();
//				}
//			}
//
//			if (blobby==null) {
//					//log().warn(err+" IS NO f1200 PDF IN dB FOR Epct ID "+epctId);
//					System.out.println(err+" IS NO f1200 PDF IN dB FOR Epct ID "+epctId);
//					response.setContentType("application/pdf");
//					response.getOutputStream().write(bytearray,0,0); 
//			} else {
//				int size=0;
//				InputStream sImage = blobby.getBinaryStream();
//				while( (size=sImage.read(bytearray)) != -1 ) {
//					//log().debug(err+" in loop reading f1200 pdf. Size this loop is "+size);
//					System.out.println(err+" in loop reading f1200 pdf. Size this loop is "+size);
//
//					response.setContentType("application/pdf");
//					response.getOutputStream().write(bytearray,0,size); 
//				}
//			}
//
//			
//			// zaph - how set filename ??
//			
//			
//			
//			response.getOutputStream().close();
//		    //log().debug(PREFIX+" AFTER loop. size NOW = "+size);
//		}
//		catch(Exception ex) {
//			//logInternalError().error(err+"Error retrieving f1200 pdf. Rqst was Epct id "+epctId, ex);
//			System.out.println(err+"Error retrieving f1200 pdf. Rqst was Epct id "+epctId+"    Excpt="+ ex.getMessage());
//		}
//	}


		
}
