package com.bcs.p3s.controller.rest;

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

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.engine.ExtractSubmittedDataEngine;
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
	
	@RequestMapping(value = "/register/rest-subsequent-user-step1/", method = RequestMethod.POST)
    public ResponseEntity<Business> createSubUserStep1(@RequestParam String businessNumber,@RequestParam String businessPin) {
		
		String msg = "createSubUserStep1(" + businessNumber + "," + businessPin +")";
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
		if(!(businessPin.equals(businessDetails.getBusinessPin()))){
			
			log().debug("User entered BusinessPin[" +businessPin + "] verified against database");
			return new ResponseEntity<Business>(businessDetails, HttpStatus.OK);
			
		}
		
		user.setBusiness(businessDetails);
		
		return new ResponseEntity<Business>(businessDetails, HttpStatus.OK);
	}
	
	@RequestMapping(value="/register/rest-subsequent-user-step2/" , method = RequestMethod.POST)
	public ResponseEntity<String> persistNewUser(@RequestBody Object object){
		
		String msg = "presistNewUser(user)";
		log().debug(msg + "invoked");
		
		//ExtractSubmittedDataEngine data = new ExtractSubmittedDataEngine();
		//P3SUser user = data.extractRegistrationForm(object);
		/*PreLoginSessionBean preSession = (PreLoginSessionBean) session.getAttribute("preSession");
		
		*//** Checking whether email Address already exist **//*
		boolean isNewUser = userService.checkUser(user.getEmailAddress());
		
		if(isNewUser){
			log().debug("Email address found stage");
			user.setStatus(UserStatusEnum.DISABLED);
			user.setUserrole("user");
			
			Business business = preSession.getBusiness();   //getting business Info from session; ignoring user manipulations
			user.setBusiness(business);
			userService.createSubUser(user);
			
			*//**
			 * Sending email address verification email to user comes here
			 *//*
		}
		else{
			//logging
			
		}*/
        
		return new ResponseEntity<String>("success", HttpStatus.OK);
	}

}
