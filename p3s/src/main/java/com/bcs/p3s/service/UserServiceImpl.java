package com.bcs.p3s.service;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.UserProfileUI;

@Service("UserService")
public class UserServiceImpl implements UserService{

	
	public UserProfileUI getUserProfileUI() {
		UserProfileUI userProfileUI = new UserProfileUI();
		return userProfileUI; 
	}
	
}
