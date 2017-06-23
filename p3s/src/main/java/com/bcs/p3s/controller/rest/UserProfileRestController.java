package com.bcs.p3s.controller.rest;

import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.service.UserService;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.EnvironmentSpecificProperties;
import com.bcs.p3s.util.config.PropertyReader;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class UserProfileRestController extends Universal {
 
    @Autowired
    UserService userService;  //Service which will do all data retrieval/manipulation work
    @Autowired
    HttpSession session ;
 
    
    //------------------- Retrieve All Patents (For this Business) --------------------------------------------------
     
    @RequestMapping(value = "/rest-user/", method = RequestMethod.GET)
    public ResponseEntity<UserProfileUI> getUserProfileUI() {
    	System.out.println("UserProfileRestController : /rest-user/ (get UserProfile) invoked ");

    	UserProfileUI userProfileUI = userService.getUserProfileUI();

        return new ResponseEntity<UserProfileUI>(userProfileUI, HttpStatus.OK);
    }
 
 
    
    //-------------------Retrieve Single User OBSOLETE - see below --------------------------------------------------------
     
    // Tmp fix - in case Patrick invoke Merin's initial API  - ie /rest-user/{user-id} 
    @RequestMapping(value = "/rest-user/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserProfileUI> obsoletegetUserProfileUI_OBS(@PathVariable("id") long id) {
    	System.out.println("UserProfileRestController : OBSOLETE /rest-user/{"+id+"}  (get UserProfile) invoked. Redirecting ... ");
        return getUserProfileUI();
    }
    
   //----------------------Update User Info ---------------------------------------------------------------------------------
    @RequestMapping(value = "/rest-user/", method = RequestMethod.PUT)
    public ResponseEntity<UserProfileUI> updateUser(@RequestBody UserProfileUI user , UriComponentsBuilder ucBuilder) {
      
        PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
        P3SUser p3sUser = pLoginSession.getUser();
        p3sUser.setEmailAddress(user.getEmailAddress());
        p3sUser.setFirstName(user.getFirstName());
        p3sUser.setLastName(user.getLastName());
        
        Business business = user.getBusiness();
        p3sUser.setBusiness(business);
        
      	String response = userService.updateUser(p3sUser,business);

      	if("success".equals(response)){
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.OK);
      		//logging
      	}
      	else{
      		return new ResponseEntity<UserProfileUI>(user, HttpStatus.NOT_MODIFIED);
      		//logging
      	}
    }
 

 
}