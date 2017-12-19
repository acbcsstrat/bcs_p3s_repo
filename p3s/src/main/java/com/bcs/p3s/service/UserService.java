package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;

public interface UserService {

	UserProfileUI getUserProfileUI(P3SUser user);
	
	String updateUser(P3SUser user, Business business);
	
	List<P3SUser> getAllUsers();
	
	void createNewUser(P3SUser user, Business business);
	
	void createSubUser(P3SUser user);
	
	Boolean isNewUser(String emailAddress);
	
	P3SUser getUserByEmailAddress(String emailAddress);
	
	Boolean checkBusinessNum(String businessNumber);
	
	List<Business> getBusinessInfo(String businessNumber);
	
	void sendRegistrationEmail(String emailAddress);
	
	void sendResetPasswordEmail(String emailAddress);
	
	String updatePassword(P3SUser user);
	

}
