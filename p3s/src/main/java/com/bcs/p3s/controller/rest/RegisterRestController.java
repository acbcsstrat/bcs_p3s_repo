package com.bcs.p3s.controller.rest;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
import com.bcs.p3s.engine.GenericProcessingEngine;
import com.bcs.p3s.enump3s.UserStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PreLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class RegisterRestController extends Universal {
	
	@Autowired
    UserService userService;
	
	@Autowired
    HttpSession session ;

	
	
	//---------------------- FE provides a CAPTCHA check ----------------
	@RequestMapping(value="/register/rest-verify-recaptcha/" , method = RequestMethod.POST)
	public ResponseEntity<String> captchaOnly(@RequestParam("g-recaptcha-response") String gRecaptchaResponse) {

		String msg = "RegisterRestController : /register/rest-verify-recaptcha/  ";
		log().debug(msg + "invoked with g-recaptcha-response");
	
		boolean isGenuine = false;

		if (isEmpty(gRecaptchaResponse)) 
			logErrorAndContinue("RegisterRestController:captchaOnly: passed empty gRecaptchaResponse");
		
		CaptcaService captcha = new CaptcaService();
		try {
			isGenuine = captcha.verify(gRecaptchaResponse);
		} catch (IOException e1) {
			log().error("RegisterRestController:captchaOnly: Problem contacting google for captcha verification", e1);
		}
		log().debug("RegisterRestController:captchaOnly validation result is "+isGenuine);
		

		if (isGenuine)
			return new ResponseEntity<String>("success", HttpStatus.OK);
		else
			return new ResponseEntity<String>("error", HttpStatus.FORBIDDEN);  // 403
	}


	
	@RequestMapping(value="/register/rest-user/" , method = RequestMethod.POST)
	public ResponseEntity<String> persistNewUser(@RequestBody Object object){
		
		String msg = "RegisterRestController : /register/rest-user/  presistNewUser(user) ";
		log().debug(msg + "invoked with parameters ::" + object.toString());
		
		try{
			int iteration = 1;
			
			GenericProcessingEngine engine = new GenericProcessingEngine();
			
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
			
			business = engine.generateBusinessPinAndNumber(business);
			
			if(business == null){
				log().error("Extract business info from Registration Form failed");
				return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
			}
	        
	        /** Checking whether the generated Business Number is unique **/
	        boolean isBusinessFound = false;
	        
	        isBusinessFound = userService.checkBusinessNum(business.getBusinessNumber());
	        
	        while(isBusinessFound && iteration < 5){
	        	log().debug("Check found the generated Business Number not unique [iteration = "  + iteration +"]");
	        	
	        	iteration++;
	        	business = engine.regenerateBusinessNumber(business);
	        	log().debug("Checking again  whether generated Business Number is unique");
	        	isBusinessFound = userService.checkBusinessNum(business.getBusinessNumber());
	        }	
			//business.persist();
			
	        log().debug("Check found the generated Business Number UNIQUE");
			
			/**
			 * Extracting user details from contentMap
			 */
			P3SUser user = data.extractUserInfo(contentMap);
			
			if(user == null){
				log().error("Extract User info from Registration Form failed");
				return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
			}
			//persist business && user
			
			//** Checking whether email Address already exist **//*
			boolean isNewUser = userService.isNewUser(user.getEmailAddress());
			
			if(isNewUser){
				log().debug("Email address does not exist. So proceed with Registration");
				user.setStatus(UserStatusEnum.DISABLED);
				user.setUserrole("user");
				//email notification default to ON
				user.setIsEmailNotification(true);
				user.setCreatedDate(Calendar.getInstance().getTime());
				user.setBusiness(business);
				userService.encryptPassword(user); // disabled until near production
				userService.createNewUser(user, business);
			}
			else{ //Error message :- Email address already exist
				log().warn("User requested register, but already has an account (albeit maybe not verified)");
				return new ResponseEntity<String>("error", HttpStatus.FOUND);
				// Here, send email anyway. User will be expecting it (maybe NEEDS it). & cannot hurt.
			}
			// Send email address verification email to user
			userService.sendRegistrationEmail(user.getEmailAddress());
		}
		
		catch(Exception e){
			logErrorAndContinue("Exception occured in " + msg, e);
			return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
		}
	        
		log().debug("User persisted, email send and method returning successfully");
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/register/rest-subsequent-user-step1/", method = RequestMethod.POST)
    public ResponseEntity<Business> createSubUserStep1(@RequestParam String businessNumber,@RequestParam String businessPin) {
		
		String msg = "RegisterRestController : /register/rest-subsequent-user-step1/ createSubUserStep1(" + businessNumber + "," + businessPin +")";
		log().debug(msg +" invoked");
		Business businessDetails = new Business();
		try{
			List<Business> businessInfo = null;
			UserProfileUI user = new UserProfileUI();
			
			/** Checking whether user entered business Number exists **/
	
			businessInfo = userService.getBusinessInfo(businessNumber);
			if(businessInfo.isEmpty()){
				log().debug("No business Details found for entered businessNumber[" + businessNumber +"]");
				return new ResponseEntity<Business>(businessDetails, HttpStatus.BAD_REQUEST);
			}
			
			log().debug("User entered business Details authenticated for  businessNumber[" + businessNumber +"]");
			businessDetails = businessInfo.get(0);
			
			/** Validate pin against user entered Pin**/
			if(businessPin.equals(businessDetails.getBusinessPin().toString())){
				
				log().debug("User entered BusinessPin[" +businessPin + "] verified against database");
				
			}
			else{
				log().debug("User entered BusinessPin[" +businessPin + "] wrong");
				return new ResponseEntity<Business>(businessDetails, HttpStatus.BAD_REQUEST);
			}
			
			user.setBusiness(businessDetails);
			
			/**
			 * setting in PreLoginSessionBean
			 */
			PreLoginSessionBean preSession = new PreLoginSessionBean();
			preSession.setBusiness(user.getBusiness());
			session.setAttribute("preSession", preSession);
			log().debug("Business details persisted in PreLoginSession and method returning business details");
		}
		catch(Exception e){
			logErrorAndContinue("Exception occured in " + msg, e);
			return new ResponseEntity<Business>(businessDetails, HttpStatus.BAD_REQUEST);
		}
			
		return new ResponseEntity<Business>(businessDetails, HttpStatus.OK);
	}
	
	@RequestMapping(value="/register/rest-subsequent-user-step2/" , method = RequestMethod.POST)
	public ResponseEntity<String> persistUser(@RequestBody Object object){
		
		String msg = "RegisterRestController : /register/rest-subsequent-user-step2/ persistUser()";
		log().debug(msg + "invoked with parameters "+ object.toString());
		
		try{
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
			if(business == null){
				log().error("Extract business info from Registration Form failed");
				return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
			}
			//business.persist();
			
			
			/**
			 * Extracting user details from contentMap
			 */
			P3SUser user = data.extractUserInfo(contentMap);
			if(user == null){
				log().error("Extract User info from Registration Form failed");
				return new ResponseEntity<String>("error", HttpStatus.NO_CONTENT);
			}
			//persist business && user
			
			//** Checking whether email Address already exist **/
			boolean isNewUser = userService.isNewUser(user.getEmailAddress());
			
			if(isNewUser){
				log().debug("Email address does not exist. So proceed with Registration");
				user.setStatus(UserStatusEnum.DISABLED);
				user.setUserrole("user");
				//setting email notification to true by default
				user.setIsEmailNotification(true);
				user.setCreatedDate(Calendar.getInstance().getTime());
				PreLoginSessionBean preSession = (PreLoginSessionBean) session.getAttribute("preSession");
				business = preSession.getBusiness();   //getting business Info from session; ignoring user manipulations
				user.setBusiness(business);
				userService.encryptPassword(user); // disabled until near production
				userService.createSubUser(user);
			}
			else{
				log().warn("User requested register, but already has an account (albeit maybe not verified)");
				return new ResponseEntity<String>("error", HttpStatus.FOUND);
				// Here, send email anyway. User will be expecting it (maybe NEEDS it). & cannot hurt.
			}
			// Send email address verification email to user
			userService.sendRegistrationEmail(user.getEmailAddress());
		}
		
		catch(Exception e){
			logErrorAndContinue("Exception occured in " + msg, e);
			return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
		}
		
		log().debug("User persisted, email send and method returning successfully");
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}
	
	/*----------- User clicked on the verify link in the email -----------*/
	
	@RequestMapping(value="/register/new-user-verify/{verifyLink}" , method = RequestMethod.GET)
	public ModelAndView enableUser(@PathVariable("verifyLink") String verifyLink, @RequestParam String emailAddress){
		
		String msg = "RegisterRestController : /register/new-user-verify/{verifyLink}  enableUser(" + emailAddress +")";
		GenericProcessingEngine genEngine = new GenericProcessingEngine();
		ModelAndView model = new ModelAndView();
		
		try{
			log().debug(msg + " invoked");
			
			P3SUser user = null;
			
			if (emailAddress == null || emailAddress.length() == 0){
				logInternalError().fatal("Email address argument missing");
				throw new IllegalArgumentException("The emailAddress argument is required");
			}
			
			user = userService.getUserByEmailAddress(emailAddress);
			
			//CHECKING user send {verifyLink} against what generated from user object
			String hashLink = genEngine.generateUrlVerificationCode(user);
			if(!(hashLink.equals(verifyLink))){
				log().error("User send an INVALID {verifyLink}. Preventing user from further operation. ["+emailAddress+" expected "+hashLink+" got "+verifyLink+"]");
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
					log().debug("Registration Completed for user " + emailAddress );
			}	
			else{
				log().warn("User status is ALREADY enabled (email url clicked again). No action required now. Redirect to login page");
			}
			
			//return to login page
		}
		catch(Exception e){
			
			logErrorAndContinue("Exception occured in " + msg, e);
			model.setViewName("error");
			return model;
		}
			
		model.setViewName("login");
		return model;
	
	}
	
	
	
	
	// support methods

}
