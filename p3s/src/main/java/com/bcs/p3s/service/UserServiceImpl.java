package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.docs.email.P3sEmail;
import com.bcs.p3s.docs.email.P3sEmailFactory;
import com.bcs.p3s.docs.email.template.EmailTemplates;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.LoginMessage;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.email.EmailSender;
import com.bcs.p3s.util.lang.Universal;

@Service("UserService")
public class UserServiceImpl extends Universal implements UserService {

	@Autowired
	HttpSession session;
	
	public UserProfileUI getUserProfileUI(P3SUser user) {
		UserProfileUI userProfileUI = new UserProfileUI();

		// Fields from P3SUser
		userProfileUI.setFirstName(user.getFirstName());
		userProfileUI.setLastName(user.getLastName());
		userProfileUI.setEmailAddress(user.getEmailAddress());
		userProfileUI.setIsEmailNotification(user.getIsEmailNotification());
		// Fields from Business
		userProfileUI.setBusiness(user.getBusiness());
		
		//Login Messages
		
		//userProfileUI.setLoginMessages(findAllLoginMessagesForUser(user));
		
		return userProfileUI; 
	}

	public String updateUser(P3SUser user, Business business) {
		
		if(user.merge() !=null && business.merge() != null)
			return "success";  //HARDCODED VALUE NEEDS REPLACEMENT
		else
			return "error";  //HARDCODED VALUE NEEDS REPLACEMENT
	}
	
	public List<P3SUser> getAllUsers(){
		
		List<P3SUser> users = null;
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		Business business = pLoginSession.getBusiness();
		TypedQuery<P3SUser> tq_p3suser = P3SUser.findP3SUsersByBusiness(business);
		users = tq_p3suser.getResultList();
		//System.out.println("####here comes the session in Service Impl "+session.getCreationTime() + "id ::" + session.getId());
		return users;
	}

	@Override
	public void createNewUser(P3SUser user, Business business) {
		
		business.persist();
		user.persist();
	}

	@Override
	public Boolean isNewUser(String emailAddress) {
		
		List<P3SUser> users = null;
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
	public P3SUser getUserByEmailAddress(String emailAddress) {

		P3SUser user = null;
		if(emailAddress != null){
			
			try{
				TypedQuery<P3SUser> tq_p3suser = P3SUser.findP3SUsersByEmailAddress(emailAddress);
				user = tq_p3suser.getSingleResult();
			}
			catch(Exception e){
				logErrorAndContinue("Error occured", e);
				return null;
			}
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
	

	
	public void sendRegistrationEmail(String emailAddress) {
		P3sEmailFactory factory = new P3sEmailFactory();
		P3sEmail email = factory.create(EmailTemplates.email_register_combined, emailAddress, null, null, null, null, null, null);

		EmailSender emailer = new EmailSender(email);
		emailer.addRecipient(emailAddress);
		emailer.sendEmail();
	}

	
	
	// support methods
	protected List<LoginMessageUI> findAllLoginMessagesForUser(P3SUser user){
		
		List<LoginMessage> loginMessages = user.getLoginMessagesToDisplay();
		List<LoginMessageUI> loginMessagesUI = new ArrayList<LoginMessageUI>();
		Calendar today = Calendar.getInstance();
		for(LoginMessage eachMessage : loginMessages){
			
			Calendar displayFrom = Calendar.getInstance();
			displayFrom.setTime(eachMessage.getDisplayFromDate());
			
			Calendar displayTill = Calendar.getInstance();
			displayTill.setTime(eachMessage.getDisplayToDate());
			
			if(today.getTime().after(displayFrom.getTime()) && today.getTime().before(displayTill.getTime())){
				LoginMessageUI messageUI = new LoginMessageUI();
				//messageUI.setMessageText(eachMessage.getMessageText());
				loginMessagesUI.add(messageUI);
			}
		}
		
		return loginMessagesUI;
		
	}

	@Override
	public void sendResetPasswordEmail(String emailAddress) {
		// TODO Auto-generated method stub
		
		//email template to be implemented
		/*P3sEmailFactory factory = new P3sEmailFactory();
		P3sEmail email = factory.create(EmailTemplates.email_register_combined, emailAddress, null, null, null, null, null, null);

		EmailSender emailer = new EmailSender(email);
		emailer.addRecipient(emailAddress);
		emailer.sendEmail();*/
		
	}

	@Override
	public String updatePassword(P3SUser user) {
		
		if(user.merge() !=null )
			return "success";  
		else
			return "error";  
	}
		
}
