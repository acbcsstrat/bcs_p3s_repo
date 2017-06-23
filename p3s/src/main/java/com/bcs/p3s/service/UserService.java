package com.bcs.p3s.service;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;

public interface UserService {

	UserProfileUI getUserProfileUI();
	
	String updateUser(P3SUser user, Business business);
	
	

}
