package com.bcs.p3s.controller.web;


import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.email.EmailDevTest;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.util.config.BuildinfoPropertyReader;
import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;


/**
 * Provides odd functionality. 
 * Usually for Internal Use Only, & provided from the actest.html page 
 * @author andyc
 *
 */
@Controller
public class MiscController extends Universal {

		@Autowired
		PatentService patentService;  //Service which will do all data retrieval/manipulation work

		protected String PREFIX = this.getClass().getName() + " : "; 

		
	    //------------------- whoami --------------------------------------------------

		@RequestMapping(value="/whereami", method = RequestMethod.GET, produces = "text/html")
	    public String whoami(Model uiModel) {
			System.out.println("whoami in MiscController invoked");

            P3SUser me = SecurityUtil.getMyUser();
            Business myBuisness = SecurityUtil.getMyBusiness();
        	List<PatentUI> patentUIs = patentService.listAllPatentUIsForMyBusiness();

        	BuildinfoPropertyReader buildinfoPropertyReader = new BuildinfoPropertyReader();
        	String buildTimestamp = buildinfoPropertyReader.getBuildTimestamp();
        	String dbname = buildinfoPropertyReader.whichDB();
    		String hostname = Hostname.getHostname();

        	
            uiModel.addAttribute("me", me);
            uiModel.addAttribute("myBusiness", myBuisness);
            uiModel.addAttribute("patents", patentUIs);
            uiModel.addAttribute("numpatents", patentUIs.size() );
            uiModel.addAttribute("buildtimestamp", buildTimestamp );
            uiModel.addAttribute("dbname", dbname );
            uiModel.addAttribute("hostname", hostname );
            
            
            return "whoami";
	    }

		
		
	    //------------------- acgenerateemail --------------------------------------------------

		@RequestMapping(value="/acgenerateemail", method = RequestMethod.POST, produces = "text/html")
	    public String acgenerateemail(Model uiModel, String emailchoice) {
			log().debug("acgenerateemail in MiscController invoked  : param = "+emailchoice);

			int code = Integer.parseInt(emailchoice);
			EmailDevTest tester = new EmailDevTest();
			tester.testByCode(code);
			
            return "blank";
	    }
	    

	    //------------------- actesttestpanic --------------------------------------------------

		@RequestMapping(value="/actesttestpanic", method = RequestMethod.POST, produces = "text/html")
	    public String actesttestpanic(Model uiModel, String message) {
			String keymessage = message;
			log().debug("actesttestpanic in MiscController invoked  : param = "+keymessage);

			String msg = null;
			String key = "Don't 0veruse";
			int lemmy = key.length();
			if (keymessage!=null && keymessage.length()>lemmy && keymessage.startsWith(key)) {
				panic("TEST from actest.html: "+keymessage.substring(lemmy));
			}
			
            return "blank";
	    }
	    

	    //------------------- logtest --------------------------------------------------

		@RequestMapping(value="/logtest", method = RequestMethod.GET, produces = "text/html")
	    public String aclogtest(Model uiModel, String message) {
			String keymessage = message;
			log().info("aclogtest in MiscController invoked  : param = "+keymessage);

            return "blank";
	    }

		

	    //------------------- Provide an avatar image --------------------------------------------------

		/**
		 * If id of P3SUser is NOT provided, provide avatar of currently-logged-in user.
		 * Otherwise, provide avatar of specified user PROVIDED that user is a colleague of currently-logged-in user.
		 * 
		 * TBC: If avatar has never been set, provide the data from the db (zero-length image)
		 */
		@RequestMapping(value = "/avatarImage", method = RequestMethod.GET)
		public void avatarImage(@RequestParam(value = "id", required = false) Long itemId, 
				HttpServletResponse response,HttpServletRequest request) throws ServletException, IOException {

			String err = PREFIX+"/avatarImage  ";
			log().debug(err + "invoked  : id = "+itemId);

			byte[] bytearray = new byte[1048576]; // 1MB. Plenty big for 10k resized Avatars
	  		P3SUser myUser = SecurityUtil.getMyUser();
	  		P3SUser selectedUser = null;

	  		
			try {

		  		if (itemId==null) selectedUser = myUser;
		  		else {
		  			selectedUser = P3SUser.findP3SUser(itemId);
		  			if ( (selectedUser==null) || 
		  			selectedUser.getBusiness().getId() != myUser.getBusiness().getId()) {
		  					err+= ("user "+myUser.getId()+" asked for invalid userId "+itemId); 
		  					logM().warn(err); throw new P3SRuntimeException(err+" asked for invalid userId "+itemId);
		  			}
		  		}

				Blob blobby = selectedUser.getAvatar();

				if (blobby==null) {
						log().warn(err+" IS NO AVATAR IN dB FOR ID "+itemId);
						response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
						response.getOutputStream().write(bytearray,0,0); 
				} else {
					int size=0;
					InputStream sImage = blobby.getBinaryStream();
					while( (size=sImage.read(bytearray)) != -1 ) {
						log().debug(err+" in loop reading avatar. Size this loop is "+size);
	
						response.setContentType("image/jpeg, image/jpg, image/png, image/gif");
						response.getOutputStream().write(bytearray,0,size); 
					}
				}

				response.getOutputStream().close();
			    //log().debug(PREFIX+" AFTER loop. size NOW = "+size);
			}
			catch(Exception ex) {
				logInternalError().error(err+"Error retrieving avatar. Rqst was id "+itemId, ex);
			}
		}

	
}
