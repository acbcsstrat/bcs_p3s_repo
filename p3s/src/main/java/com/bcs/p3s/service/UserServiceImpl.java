package com.bcs.p3s.service;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;

@Service("UserService")
public class UserServiceImpl implements UserService{

	
	public UserProfileUI getUserProfileUI() {
		UserProfileUI userProfileUI = new UserProfileUI();
		return userProfileUI; 
	}

	
	public String updateUser(P3SUser user, Business business) {
		
		if(user.merge() !=null && business.merge() != null)
			return "success";  //HARDCODED VALUE NEEDS REPLACEMENT
		else
			return "error";  //HARDCODED VALUE NEEDS REPLACEMENT
				
	}
	
}
