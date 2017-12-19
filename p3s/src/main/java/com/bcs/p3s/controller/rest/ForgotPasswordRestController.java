/**
 * 
 */
package com.bcs.p3s.controller.rest;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.enump3s.UserStatusEnum;
import com.bcs.p3s.model.Business;
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
public class ForgotPasswordRestController extends Universal{
	
	@Autowired
    UserService userService;
	
	@Autowired
    HttpSession session;
	
	//----------------------API 1.12 Forgot Password – step 1 – Enter email address ----------------
	
	@RequestMapping(value="/prelogin/rest-forgot-password/" , method = RequestMethod.POST)
	public ResponseEntity<P3SUser> confirmUser(@RequestParam String emailAddress){
		
		String msg = "ForgotPasswordRestController : /prelogin/rest-forgot-password/  confirmUser(emailAddress) ";
		log().debug(msg + "invoked with parameters ::" + emailAddress);
		
		P3SUser user = new P3SUser();
		try{
			
			if (emailAddress == null || emailAddress.length() == 0){
				log().error("Email address argument missing");
				return new ResponseEntity<P3SUser>(user, HttpStatus.BAD_REQUEST);
			}
			
			user = userService.getUserByEmailAddress(emailAddress);
			
			if(user == null){
				log().debug("User "+ emailAddress +" not found");
				return new ResponseEntity<P3SUser>(user, HttpStatus.BAD_REQUEST);
			}
			
			if(UserStatusEnum.DISABLED.equalsIgnoreCase(user.getStatus())){
				log().debug("User "+ emailAddress +" has status DISABLED. Registration process not yet completed");
				return new ResponseEntity<P3SUser>(user, HttpStatus.FORBIDDEN);  //Please verify your email address before proceeding with Forgot Password
			}
			
			log().debug("User[" +emailAddress +"] found with status as ENABLED. Proceed sending email");
			userService.sendResetPasswordEmail(emailAddress);
			
		}
		catch(Exception e){
			
			logErrorAndContinue("Exception occured in "+msg, e);
			return new ResponseEntity<P3SUser>(user, HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<P3SUser>(user, HttpStatus.OK);
		
	}
	
	
	//----------------------API 1.13 Forgot Password – step 2  – Verify reset password link in email ---------
	
	@RequestMapping(value="/prelogin/rest-forgot-password/{verfiyLink}" , method = RequestMethod.GET)
	public ModelAndView verifyLink(@PathVariable("verifyLink") String verifyLink, @RequestParam String emailAddress){
		
		ModelAndView model = new ModelAndView();
		
		model.setViewName("reset-password");
		return model;
		
	}
	
	

	//----------------------API 1.14 Forgot Password – step 3  – Update password for the user ----------------
	
	@RequestMapping(value="/prelogin/rest-forgot-password/" , method = RequestMethod.PUT)
	public ModelAndView changePassword(@RequestParam String emailAddress,@RequestParam String password){
			
		String msg = "ForgotPasswordRestController : /prelogin/rest-forgot-password/  changePassword(password) ";
		log().debug(msg + "invoked with new password as ::" + password + " for user[" + emailAddress + "]");
		String updateSuccess = "";
		P3SUser user = new P3SUser();
		ModelAndView model = new ModelAndView();
			
		try{
				
			if (emailAddress == null || emailAddress.length() == 0 || password == null || password.length() == 0){
				log().error("Email address/ password parameter missing");
				model.setViewName("error");
				return model;
			}
				
			user = userService.getUserByEmailAddress(emailAddress);
				
			if(user == null){
				log().debug("User "+ emailAddress +" not found");
				model.setViewName("error");
				return model;
			}
				
			user.setPassword(password);
			updateSuccess = userService.updatePassword(user);
				
			if("success".equals(updateSuccess))
				log().debug("Password reset successfully");
			else{
				log().error("Password reset failed");
				model.setViewName("error");
				return model;
			}
				
		}
		catch(Exception e){
			logErrorAndContinue("Exception occured in "+msg, e);
			model.setViewName("error");
		}
			
		model.setViewName("login");
			
		return model;
			
	}
}
