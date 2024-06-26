package com.bcs.p3s.controller.rest;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.engine.GenericProcessingEngine;
import com.bcs.p3s.enump3s.UserStatusEnum;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PreLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

/**
 * Prelogin forgot password functionality
 * @author MerinP
 *
 */

@RestController
public class ForgotPasswordRestController extends Universal {
	
	@Autowired
    UserService userService;
	
	@Autowired
    HttpSession session;
	
	//----------------------API 1.12 Forgot Password – step 1 – Enter email address ----------------
	
	@RequestMapping(value="/prelogin/rest-forgot-password/" , method = RequestMethod.POST)
	public ResponseEntity<String> confirmUser(@RequestParam String emailAddress){
		
		String msg = "ForgotPasswordRestController : /prelogin/rest-forgot-password/  confirmUser(emailAddress) ";
		log().debug(msg + "invoked with parameters ::" + emailAddress);
		
		String hashLink = "";
		String fullLink = "";
		
		P3SUser user = new P3SUser();
		try{
			
			if (isEmpty(emailAddress)){
				log().error("Email address argument missing");
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
			}
			
			user = userService.getUserByEmailAddress(emailAddress);
			
			if(user == null){
				log().debug("Forgot Passowrd: User "+ emailAddress +" not found  - from "+msg);
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
			}
			
			if(UserStatusEnum.DISABLED.equalsIgnoreCase(user.getStatus())){
				log().debug("User "+ emailAddress +" has status DISABLED. Registration process not yet completed");
				return new ResponseEntity<String>("error", HttpStatus.FORBIDDEN);  //Please verify your email address before proceeding with Forgot Password
			}
			
			log().debug("User[" +emailAddress +"] found with status as ENABLED. Proceed sending email");
			
			// Cread code used to verify the eventual request
			GenericProcessingEngine genEngine = new GenericProcessingEngine();
			hashLink = genEngine.generateUrlVerificationCode(user);
			//fullLink = context+"/prelogin/rest-forgot-password/"+hashLink+"?emailAddress="+emailAddress;

			userService.sendResetPasswordEmail(emailAddress, hashLink);
			
		}
		catch(Exception e){
			
			logErrorAndContinue("Exception occured in "+msg, e);
			return new ResponseEntity<String>("Error", HttpStatus.NO_CONTENT);
		}
		
		return new ResponseEntity<String>("success", HttpStatus.OK); 
	}
	
	
	//----------------------API 1.13 Forgot Password – step 2  – Verify reset password link in email ---------
	
	/**
	 * Note : No expiry for the reset password link; verifyLink to verify whether request being triggered from valid url
	 * @param verifyLink
	 * @param emailAddress
	 * @return
	 */
	
	@RequestMapping(value="/prelogin/rest-forgot-password/{verifyLink}" , method = RequestMethod.GET)
	public ModelAndView verifyLink(@PathVariable("verifyLink") String verifyLink, @RequestParam String emailAddress){
		
		ModelAndView model = new ModelAndView();
		GenericProcessingEngine genEngine = new GenericProcessingEngine();
		
		String msg = "ForgotPasswordRestController : /prelogin/rest-forgot-password/{verfiyLink}  verifyLink(emailAddress) ";
		log().debug(msg + "invoked with parameters ::" + emailAddress +" and verifyLink " + verifyLink);
		
		P3SUser user = null;
		
		if (isEmpty(emailAddress)){
			logM().warn("Email address argument missing");
			throw new IllegalArgumentException("The emailAddress argument (from the forgot password email) is required");
		}
		
		user = userService.getUserByEmailAddress(emailAddress);
		
		if(user == null){
			log().debug("User "+ emailAddress +" not found");
			model.setViewName("error");
			return model;
		}
		
		//CHECKING user send {verifyLink} against what generated from user object
		String hashLink = genEngine.generateUrlVerificationCode(user);
		if(!(hashLink.equals(verifyLink))){
			log().error("User send an INVALID {verifyLink}. Preventing user from further operation. ["+emailAddress+" expected "+hashLink+" got "+verifyLink+"]");
			model.setViewName("error");
			return model;
		}
		
		log().debug("URL verified.");
		
		PreLoginSessionBean preSession = new PreLoginSessionBean();
		preSession.setUser(user);
		preSession.setBusiness(user.getBusiness());
		session.setAttribute("preSession", preSession);
		
		log().debug("User details persisted in session");
		
		model.setViewName("reset-password");
		return model;
		
	}
	
	

	//----------------------API 1.14 Forgot Password – step 3  – Update password for the user ----------------
	
	@RequestMapping(value="/prelogin/rest-reset-password/" , method = RequestMethod.POST)
	public ResponseEntity<String> changePassword(@RequestParam String password){
			
		String msg = "ForgotPasswordRestController : /prelogin/rest-forgot-password/  changePassword(password) ";
		log().debug(msg + "invoked with new password as ::" + password );
		String updateSuccess = "";
		P3SUser user = new P3SUser();
			
		try{
				
			if (password == null || password.length() == 0){
				log().error("New password parameter missing");
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
			}
				
			PreLoginSessionBean preSession = (PreLoginSessionBean) session.getAttribute("preSession");
			if(preSession == null){
				log().error("No presession set. Unauthorised acces to page");
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
				
			}
			
			user = preSession.getUser();
			
			if(user == null){
				log().error("No User object set. May be no presession set. Unauthorised acces to page");
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
				
			}
			
			user.setPassword(password);
			updateSuccess = userService.updatePassword(user);
				
			if("success".equals(updateSuccess))
				log().debug("Password reset successfully");
			else{
				log().error("Password reset failed");
				return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
				
			}
				
		}
		catch(Exception e){
			logErrorAndContinue("Exception occured in "+msg, e);
			return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
		}
			
		return new ResponseEntity<String>("success", HttpStatus.OK);
			
	}
}
