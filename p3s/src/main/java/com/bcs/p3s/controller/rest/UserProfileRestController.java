package com.bcs.p3s.controller.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.security.SecurityUtil;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class UserProfileRestController extends Universal {
 
    @Autowired
    UserService userService;  //Service which will do all data retrieval/manipulation work
  
    @Autowired
    HttpSession session ;
 
    
    //------------------- Retrieve details for this currently-logged-in User --------------------------------------------------
     
    @RequestMapping(value = "/rest-user/", method = RequestMethod.GET)
    public ResponseEntity<UserProfileUI> getUserProfileUI() {
    	
    	String msg = "UserProfileRestController : /rest-user/ (get UserProfile)";
    	log().debug(msg +" invoked");
    	PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
        P3SUser p3sUser = pLoginSession.getUser();
    	UserProfileUI userProfileUI = userService.getUserProfileUI(p3sUser);

    	log().debug(msg +" returning current User Information");
        return new ResponseEntity<UserProfileUI>(userProfileUI, HttpStatus.OK);
    }
 
 
    
    //-------------------Update User  --------------------------------------------------------

    @RequestMapping(value = "/rest-user/", method = RequestMethod.PUT)
    public ResponseEntity<UserProfileUI> updateUser(@RequestBody UserProfileUI obUser , UriComponentsBuilder ucBuilder) {
      
    	String msg = "UserProfileRestController : /rest-user/ updateUser()";

    	log().debug(msg + " invoked");
    	if ( ! ( obUser instanceof UserProfileUI)) throw new P3SRuntimeException("UserProfileRestController : /rest-user/ updateUser() NOT passed UserProfileUI object");
    	
    	UserProfileUI user = (UserProfileUI) obUser;
    	
        PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
        P3SUser p3sUser = pLoginSession.getUser();

        // Verify not updating some other user!
    	if ( (p3sUser==null) || ! p3sUser.getEmailAddress().equals(user.getEmailAddress())) {
    		String eMsg = "*** [failMalicious]   [on checkUpdatingOwnUser]  ***  " +"(user "+ ((p3sUser==null)?"NuLL":p3sUser.getId()) +" attempted set email "+user.getEmailAddress()+")  ***";
    		System.out.println(eMsg); logM().fatal(eMsg); throw new P3SRuntimeException(eMsg);
    	}

    	// Make the changes
        //p3sUser.setEmailAddress(user.getEmailAddress()); // prevent user changing email address! - as no reVerify yet
        p3sUser.setFirstName(user.getFirstName());
        p3sUser.setLastName(user.getLastName());
        p3sUser.setIsEmailNotification(user.getIsEmailNotification());

        //updating User password
        if( ! isEmpty(user.getNewPassword())) {
        		p3sUser.setPassword(user.getNewPassword());
        		log().debug(msg + "User password got updated");
        }
        
        //p3sUser.setIsEmailNotification(false);
        Business business = user.getBusiness();
        business.setVersion(p3sUser.getBusiness().getVersion());
        business.setBusinessName(p3sUser.getBusiness().getBusinessName()); // prevent user changing business name
        p3sUser.setBusiness(business);
        
      	String response = userService.updateUser(p3sUser,business);

      	if("success".equals(response)){
      		//set the session object with the updated values from DB
      		P3SUser myUser = SecurityUtil.getMyUser();
      		pLoginSession.setUser(myUser);
        	Business myBusiness = SecurityUtil.getMyBusiness();
        	pLoginSession.setBusiness(myBusiness);
            session.setAttribute("postSession",pLoginSession);
            log().debug(msg + " returning success after updating User Information");
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.OK);
      	}
      	else{
      		log().debug(msg + " failed to update User Information");
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.NOT_MODIFIED);
      	}
    }
    
    
    //-----------------------List all users for my business---------------------------------------------------------------------
 
    @RequestMapping(value = "/rest-users/", method = RequestMethod.GET)
    public ResponseEntity<List<UserProfileUI>> listUsers() {
    	
    	String msg = "UserProfileRestController : /rest-users/ (listUsers())";
    	log().debug(msg +" invoked");
    	List<UserProfileUI> userProfileUI = new ArrayList<UserProfileUI>();
    	List<P3SUser> p3sUser = userService.getAllUsers();
    	
    	if(p3sUser.isEmpty()){
    		log().debug("User object null");
    		return new ResponseEntity<List<UserProfileUI>>(userProfileUI, HttpStatus.BAD_REQUEST);
    	}
    	
    	for(P3SUser user  : p3sUser){
    		UserProfileUI userUI = new UserProfileUI();
    		userUI = userService.getUserProfileUI(user);
    		userProfileUI.add(userUI);
    	}
    	
    	log().debug(msg +" returning all Users for the current business");
        return new ResponseEntity<List<UserProfileUI>>(userProfileUI, HttpStatus.OK);
    }
    
    
    //----------------------- Default Controller in case nowt else matches ---------------------------------------------------------------------

 
}