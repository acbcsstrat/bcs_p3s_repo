package com.bcs.p3s.controller.rest;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.docs.email.P3sEmailFactory;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.engine.GenericProcessingEngine;
import com.bcs.p3s.enump3s.UserStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PreLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class RegisterRestController extends Universal{
	
	@Autowired
    UserService userService;
	
	@Autowired
    HttpSession session ;
	
	@RequestMapping(value="/register/rest-user/" , method = RequestMethod.POST)
	public ResponseEntity<String> persistNewUser(@RequestBody Object object){
		
		String msg = "RegisterRestController : /register/rest-user/  presistNewUser(user) ";
		log().debug(msg + "invoked");
		
		DummyDataEngine engine = new DummyDataEngine();
		
		System.out.println(object);
		ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
		HashMap<String, Object> contentMap = data.extractRegistrationForm(object);
		
		if(contentMap == null){
			log().error("Extract data from Registration Form failed");
			return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
		}
			
		/**
		 * Extracting business details from contentMap
		 */
		Business business = data.extractBusinessInfo(contentMap);
		
		business = engine.generatePinNumber(business);
        
        /** Checking whether the generated Business Number is unique **/
        boolean isBusinessFound = true;
        
        while(isBusinessFound){
        	business = engine.generatePinNumber(business);
        	isBusinessFound = userService.checkBusinessNum(business.getBusinessNumber());
        }	
		//business.persist();
		
		
		/**
		 * Extracting user details from contentMap
		 */
		P3SUser user = data.extractUserInfo(contentMap);
		//persist business && user
		
		//** Checking whether email Address already exist **//*
		boolean isNewUser = userService.checkUser(user.getEmailAddress());
		
		if(isNewUser){
			log().debug("Email address found stage");
			user.setStatus(UserStatusEnum.DISABLED);
			user.setUserrole("user");
			//email notification default to OFF
			user.setIsEmailNotification(true);
			user.setBusiness(business);
			userService.createNewUser(user, business);
			
			/**
			 * 
			 * Sending email address verification email to user comes here - AC to add
			 */
			new P3sEmailFactory().create(EmailTemplates.email_register_combined, user.getEmailAddress(), null, null, null, null, null, null);
		}
		else{
			//logging
			
		}
        
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/register/rest-subsequent-user-step1/", method = RequestMethod.POST)
    public ResponseEntity<Business> createSubUserStep1(@RequestParam String businessNumber,@RequestParam String businessPin) {
		
		String msg = "RegisterRestController : /register/rest-subsequent-user-step1/ createSubUserStep1(" + businessNumber + "," + businessPin +")";
		log().debug(msg +" invoked");
		
		List<Business> businessInfo = null;
		Business businessDetails = new Business();
		UserProfileUI user = new UserProfileUI();
		
		/** Checking whether user entered business Number exists **/

		businessInfo = userService.getBusinessInfo(businessNumber);
		if(businessInfo.isEmpty()){
			log().debug("No business Details found for entered businessNumber[" + businessNumber +"]");
			log().fatal("No business Details found for entered businessNumber[" + businessNumber +"]");
			return new ResponseEntity<Business>(businessDetails, HttpStatus.NOT_FOUND);
		}
		
		log().debug("User entered business Details authenticated for  businessNumber[" + businessNumber +"]");
		businessDetails = businessInfo.get(0);
		
		/** Validate pin against user entered Pin**/
		if(!(businessPin.equals(businessDetails.getBusinessPin().toString()))){
			
			log().debug("User entered BusinessPin[" +businessPin + "] verified against database");
			return new ResponseEntity<Business>(businessDetails, HttpStatus.OK);
			
		}
		
		user.setBusiness(businessDetails);
		
		/**
		 * setting in PreLoginSessionBean
		 */
		PreLoginSessionBean preSession = new PreLoginSessionBean();
		preSession.setBusiness(user.getBusiness());
		session.setAttribute("preSession", preSession);
		
		return new ResponseEntity<Business>(businessDetails, HttpStatus.OK);
	}
	
	@RequestMapping(value="/register/rest-subsequent-user-step2/" , method = RequestMethod.POST)
	public ResponseEntity<String> persistUser(@RequestBody Object object){
		
		String msg = "RegisterRestController : /register/rest-subsequent-user-step2/ persistUser()";
		log().debug(msg + "invoked");
		
		System.out.println(object);
		ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
		HashMap<String, Object> contentMap = data.extractRegistrationForm(object);
		
		if(contentMap == null){
			log().error("Extract data from Registration Form failed");
			return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
		}
			
		/**
		 * Extracting business details from contentMap
		 */
		Business business = data.extractBusinessInfo(contentMap);
		//business.persist();
		
		
		/**
		 * Extracting user details from contentMap
		 */
		P3SUser user = data.extractUserInfo(contentMap);
		//persist business && user
		
		//** Checking whether email Address already exist **/
		boolean isNewUser = userService.checkUser(user.getEmailAddress());
		
		
		if(isNewUser){
			log().debug("Email address found stage");
			user.setStatus(UserStatusEnum.DISABLED);
			user.setUserrole("user");
			//setting email notification to true by default
			user.setIsEmailNotification(true);
			PreLoginSessionBean preSession = (PreLoginSessionBean) session.getAttribute("preSession");
			business = preSession.getBusiness();   //getting business Info from session; ignoring user manipulations
			user.setBusiness(business);
			userService.createSubUser(user);
			
			/**
			 * Sending email address verification email to user comes here
			 */
			new P3sEmailFactory().create(EmailTemplates.email_register_combined, user.getEmailAddress(), null, null, null, null, null, null);
			
		}
		else{
			//logging
			
		}
        
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}
	
	/*----------- User clicked on the verify link in the email -----------*/
	
	@RequestMapping(value="/register/new-user-verify/{verifyLink}" , method = RequestMethod.GET)
	public ModelAndView enableUser(@PathVariable("verifyLink") String verifyLink, @RequestParam String emailAddress){
		
		String msg = "RegisterRestController : /register/new-user-verify/{verifyLink}  enableUser(" + emailAddress +")";
		GenericProcessingEngine genEngine = new GenericProcessingEngine();
		ModelAndView model = new ModelAndView();
		
		log().debug(msg + " invoked");
		
		P3SUser user = null;
		
		if (emailAddress == null || emailAddress.length() == 0){
			logM().debug("Email address argument missing");
			throw new IllegalArgumentException("The emailAddress argument is required");
		}
		
		user = userService.getUserByEmailAddress(emailAddress);
		
		//CHECKING user send {verifyLink} against what generated from user object
		String hashLink = genEngine.generateUrlVerificationCode(user);
		if(!(hashLink.equals(verifyLink))){
			logM().debug("User send an INVALID {verifyLink}. Preventing user from further operation");
			model.setViewName("error");
			return model;
		}
		
		//create an error page 
		if(user == null){
			fail(msg+"Unable to retrieve userdata for "+emailAddress);
		}
		
		if(UserStatusEnum.DISABLED.equals(user.getStatus())){
				user.setStatus(UserStatusEnum.ENABLED);
				userService.updateUser(user, user.getBusiness());
				log().debug("User["+ emailAddress  +"] ****VERIFIED AND ACTIVATED****.Redirecting to Login Page");
		}	
		else{
			log().debug("User status is enabled. No action required now. Redirect to login page");
			logM().debug("User status is enabled. No action required now. Redirect to login page");
		}
		
		//return to login page
		
		model.setViewName("login");
		return model;
	
	}

}
