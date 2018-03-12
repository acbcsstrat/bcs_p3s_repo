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
    	System.out.println("UserProfileRestController : /rest-user/ (get UserProfile) invoked ");

    	 PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
         P3SUser p3sUser = pLoginSession.getUser();
    	UserProfileUI userProfileUI = userService.getUserProfileUI(p3sUser);

    	
        return new ResponseEntity<UserProfileUI>(userProfileUI, HttpStatus.OK);
    }
 
 
    
    //-------------------Retrieve Single User OBSOLETE - see below --------------------------------------------------------

// Commented out 10/10/17 - should now be safe 
//    // Tmp fix - in case Patrick invoke Merin's initial API  - ie /rest-user/{user-id} 
//    @RequestMapping(value = "/rest-user/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<UserProfileUI> obsoletegetUserProfileUI_OBS(@PathVariable("id") long id) {
//    	System.out.println("UserProfileRestController : OBSOLETE /rest-user/{"+id+"}  (get UserProfile) invoked. Redirecting ... ");
//        return getUserProfileUI();
//    }
    
   //----------------------Update User Info ---------------------------------------------------------------------------------
//    @RequestMapping(value = "/rest-user/", method = RequestMethod.PUT)
//    public ResponseEntity<UserProfileUI> updateUser(@RequestBody UserProfileUI user , UriComponentsBuilder ucBuilder) {
    @RequestMapping(value = "/rest-user/", method = RequestMethod.PUT)
    public ResponseEntity<UserProfileUI> updateUser(@RequestBody UserProfileUI obUser , UriComponentsBuilder ucBuilder) {
      
    	String err = "UserProfileRestController updateUser [PUT] : ";
//    	log().fatal(" REACHED    AAAAAAAAAAAAAAAAAAAAAA  UserProfileRestController updateUser ");
    	//String msg = " ****************** "+"UserProfileRestController updateUser invoked with UserProfileUI of "+obUser.getClass().getName();
    	//log().fatal(msg);
    	//    	System.out.println(msg);
//    	System.out.println(" ****************** ");
//    	System.out.println(" ****************** ");
//    	System.out.println(" ****************** "); // acTidy

    	if ( ! ( obUser instanceof UserProfileUI)) notYet("updateUser given object which is NOT a UserProfileUI");
    	
    	
    	UserProfileUI user = (UserProfileUI) obUser;
    	
        PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
        P3SUser p3sUser = pLoginSession.getUser();
        p3sUser.setEmailAddress(user.getEmailAddress());
        p3sUser.setFirstName(user.getFirstName());
        p3sUser.setLastName(user.getLastName());
        p3sUser.setIsEmailNotification(user.getIsEmailNotification());
        
        //updating password as well
        if(!(user.getNewPassword() == null)){
        		p3sUser.setPassword(user.getNewPassword());
        		log().debug(err + "User updated password as well");
        }
        
        //p3sUser.setIsEmailNotification(false);
        Business business = user.getBusiness();
        business.setVersion(p3sUser.getBusiness().getVersion());
        p3sUser.setBusiness(business);
        
      	String response = userService.updateUser(p3sUser,business);

      	if("success".equals(response)){
      		//set the session object with the updated values from DB
      		P3SUser myUser = SecurityUtil.getMyUser();
      		pLoginSession.setUser(myUser);
        	Business myBusiness = SecurityUtil.getMyBusiness();
        	pLoginSession.setBusiness(myBusiness);
            session.setAttribute("postSession",pLoginSession);
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.OK);
      		//logging
      	}
      	else{
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.NOT_MODIFIED);
      		//logging
      	}
    }
    
    
    //-----------------------List all users for my business---------------------------------------------------------------------
 
    @RequestMapping(value = "/rest-users/", method = RequestMethod.GET)
    public ResponseEntity<List<UserProfileUI>> listUsers() {
    	
    	System.out.println("Inside listUsers");
    	System.out.println("####here comes the session in Controller "+session.getCreationTime() + "id ::" + session.getId());
    	   	
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
    	
        return new ResponseEntity<List<UserProfileUI>>(userProfileUI, HttpStatus.OK);
    }
    
    
    //----------------------- Default Controller in case nowt else matches ---------------------------------------------------------------------

 
}