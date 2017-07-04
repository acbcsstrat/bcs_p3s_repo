package com.bcs.p3s.controller.prelogin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.email.SendEmail;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.enump3s.UserStatus;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PreLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;


@Controller
public class RegistrationController extends Universal{
	
	
    @Autowired
	UserService userService;  
    HttpSession session;
    PreLoginSessionBean preSession = new PreLoginSessionBean();
    
    DummyDataEngine engine = new DummyDataEngine();
    
	 
	@RequestMapping(value = "/prelogin/new-user", method = RequestMethod.POST)
    public String createNewUser(@Valid P3SUser p3sUser, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
		
		
		/** Checking whether email Address already exist **/
		boolean isNewUser = userService.checkUser(p3sUser.getEmailAddress());
		
		
		
		if(isNewUser){
			
			p3sUser.setStatus("disabled");
	        p3sUser.setUserrole("user");
	        
	        Business business = p3sUser.getBusiness();
	        //hardcoded values .. need to be changed later 
	        business.setTimezone("utc");
	        business.setIsBillingAddressSame(false);
	        //hardcoded values end
	        
	        business = engine.generatePinNumber(business);
	        
	        /** Checking whether the generated Business Number is unique **/
	        boolean isBusinessFound = true;
	        
	        while(isBusinessFound){
	        	business = engine.generatePinNumber(business);
	        	isBusinessFound = userService.checkBusinessNum(business.getBusinessNumber());
	        }	
	        
	        p3sUser.setBusiness(business);
			userService.createNewUser(p3sUser, business);
			
			/**send email to be implemented later
			 * 
			 * two mails to be send out ::
			 * 		1. for verifying user's email address (send once create a new User)
			 * 		2. for initial user registration need to send the Business Pin and Business Number ( to be send after verifying email address ::: inside verifyEmail(); )
			 */
			
	        uiModel.addAttribute("emailAddress", p3sUser.getEmailAddress());  //this line can be removed once email functionality got implemented
			return "reg-success";
		}
		else{
			//logging
			uiModel.addAttribute("p3sUser",p3sUser);
			uiModel.addAttribute("error", "User email address already exist");
		}
        
		return "new-user";
        
		
	}
	
	@RequestMapping(value = "/prelogin/new-user", method = RequestMethod.GET)
    public String getNewUserPage(){
		System.out.println("Inside Reg Controller");
		return "new-user";
	}
	
	
	@RequestMapping(value = "/prelogin/reg-success", method = RequestMethod.GET)
    public String getSuccessPage(Model uiModel){
		System.out.println("Inside Success");
		return "reg-success";
	}
	
	@RequestMapping(value = "/prelogin/new-user-verify", method = RequestMethod.GET)
    public String verifyEmail(@RequestParam("email") String email){
		System.out.println("Inside user verification with email address passed as "+ email);
		
		List<P3SUser> user = null;
		
		if (email == null || email.length() == 0){
			logM().debug("Email address argument missing");
			throw new IllegalArgumentException("The emailAddress argument is required");
		}
		
		
		user = userService.getUserByEmailAddress(email);
		
		if(user == null || user.size() != 1){
			logM().debug("Error retrieving user Info");
			return "error";
		}
		
		if(UserStatus.DISABLED.equals(user.get(0).getStatus())){
				user.get(0).setStatus(UserStatus.ENABLED);
				userService.updateUser(user.get(0), user.get(0).getBusiness());
		}	
		else{
			logM().debug("User status is enabled. No action required now");
			return "error";
		}
			
		return "login";
	}
	
	
	@RequestMapping(value = "/prelogin/sub-user", method = RequestMethod.GET)
    public String getSubUserPage(){
		System.out.println("Inside Sub Controller");
		return "sub-user";
	}
	
	@RequestMapping(value = "/prelogin/sub-user", method = RequestMethod.POST)
    public String createSubUserStep1(@Valid Business business, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest)  {
		
		System.out.println("Inside sub Controller step1");
		System.out.println("Parameters from front end : "+ business.getBusinessNumber() +" and " + business.getBusinessPin());
		
		List<Business> businessInfo = null;
		Business businessDetails = new Business();
		UserProfileUI user = new UserProfileUI();
		
		/** Checking whether user entered business Number exists **/

		businessInfo = userService.getBusinessInfo(business.getBusinessNumber());
		if(businessInfo.isEmpty()){
			uiModel.addAttribute("error", "Incorrect business details");
			return "sub-user";
		}
		
		businessDetails = businessInfo.get(0);
		
		/** Validate pin against Business Number**/
		if(!(business.getBusinessPin().equals(businessDetails.getBusinessPin()))){
			uiModel.addAttribute("error", "Incorrect business details");
			return "sub-user";
		}
		
		user.setBusiness(businessDetails);
		
		/**
		 * Setting current business Info in session
		 */
		session = httpServletRequest.getSession();
		preSession.setBusiness(businessDetails);
		session.setAttribute("preSession", preSession);
		
		uiModel.addAttribute("user", user);
		return "sub-user2";
        
	}
	
	@RequestMapping(value = "/prelogin/sub-user2", method = RequestMethod.POST)
    public String createSubUserStep2(@Valid P3SUser user, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest){
		
		System.out.println("Inside Sub User2 Controller");
		/** 
		 * 
		 * Code to check whether user manipulated any business data send in the previous request
		 * */
		System.out.println("Retrieving from session ");
		PreLoginSessionBean preSession = (PreLoginSessionBean) session.getAttribute("preSession");
		
		/** Checking whether email Address already exist **/
		boolean isNewUser = userService.checkUser(user.getEmailAddress());
		
		if(isNewUser){
			user.setStatus("disabled");
			user.setUserrole("user");
			
			Business business = preSession.getBusiness();   //getting business Info from session; ignoring user manipulations
			user.setBusiness(business);
			userService.createSubUser(user);
			
			/**
			 * Sending email address verification email to user comes here
			 */
			return "reg-success";
		}
		else{
			//logging
			uiModel.addAttribute("user",user);
			uiModel.addAttribute("error", "User email address already exist");
		}
        
		return "sub-user2";
	}
}
