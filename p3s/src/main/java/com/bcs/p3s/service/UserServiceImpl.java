package com.bcs.p3s.service;

import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;

@Service("UserService")
public class UserServiceImpl implements UserService{

	@Autowired
	HttpSession session;
	
	public UserProfileUI getUserProfileUI(P3SUser user) {
		UserProfileUI userProfileUI = new UserProfileUI();
		
		//DummyDataEngine dummy = new DummyDataEngine();
		
				//P3SUser myUser = SecurityUtil.getMyUser();
		    	//Business myBusiness = SecurityUtil.getMyBusiness();

		    	// Fields from P3SUser
		    	userProfileUI.setFirstName(user.getFirstName());
		    	userProfileUI.setLastName(user.getLastName());
		    	userProfileUI.setEmailAddress(user.getEmailAddress());
		    	
		    	// Fields from Business
		    	userProfileUI.setBusiness(user.getBusiness());
		return userProfileUI; 
	}

	
	public String updateUser(P3SUser user, Business business) {
		
		if(user.merge() !=null && business.merge() != null)
			return "success";  //HARDCODED VALUE NEEDS REPLACEMENT
		else
			return "error";  //HARDCODED VALUE NEEDS REPLACEMENT
				
	}
	
	public List getAllUsers(){
		
		List<P3SUser> users = null;
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		Business business = pLoginSession.getBusiness();
		TypedQuery<P3SUser> tq_p3suser = P3SUser.findP3SUsersByBusiness(business);
		users = tq_p3suser.getResultList();
		System.out.println("####here comes the session in Service Impl "+session.getCreationTime() + "id ::" + session.getId());
		return users;
	}


	@Override
	public void createNewUser(P3SUser user, Business business) {
		business.persist();
		user.persist();
	}


	@Override
	public Boolean checkUser(String emailAddress) {
		
		List users = null;
		Boolean isNewUser = false;;
		if(emailAddress != null){
			TypedQuery<P3SUser> tq_p3suser = P3SUser.findP3SUsersByEmailAddress(emailAddress);
			users = tq_p3suser.getResultList();
		}
		if(users.size() == 0)
			isNewUser = true;
		else
			isNewUser = false;
		
		return isNewUser;
		
	}


	@Override
	public List<P3SUser> getUserByEmailAddress(String emailAddress) {

		List<P3SUser> user = null;
		if(emailAddress != null){
			TypedQuery<P3SUser> tq_p3suser = P3SUser.findP3SUsersByEmailAddress(emailAddress);
			user = tq_p3suser.getResultList();
		}
		return user;
	}


	@Override
	public Boolean checkBusinessNum(String businessNumber) {
		
		TypedQuery<Business> q = Business.findBusinessesByBusinessNumber(businessNumber);
		if(q.getResultList().size() == 0)
			return false;
		else
			return true;
	}


	@Override
	public List<Business> getBusinessInfo(String businessNumber) {

		List<Business> business = null;
		TypedQuery<Business> q = Business.findBusinessesByBusinessNumber(businessNumber);
		
		business = q.getResultList();
		return business;
	}


	@Override
	public void createSubUser(P3SUser user) {
		user.persist();
		
	}
	
	
	
	
}
