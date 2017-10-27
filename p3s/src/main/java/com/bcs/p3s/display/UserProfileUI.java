package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;

/**
 * This object is mostly (totally?) a combination of P3SUser and Business
 * 
 * This is different from most *UI classes, in that there is only one UserProfile item.
 * But - that item is more dispered than most 
 * 
 * @author andyc
 */
public class UserProfileUI {

	// The 4 fields from P3SUser
    private String firstName;
    private String lastName;
    private String emailAddress;
    
    private String newPassword;
    
    private Boolean isEmailNotification;

    private Business business;
    
    private List<LoginMessageUI> loginMessages;
	
	public UserProfileUI() {
		

	}




	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public Boolean getIsEmailNotification() {
		return isEmailNotification;
	}

	public void setIsEmailNotification(Boolean isEmailNotification) {
		this.isEmailNotification = isEmailNotification;
	}

	public Business getBusiness() {
		return business;
	}

	public void setBusiness(Business business) {
		this.business = business;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public List<LoginMessageUI> getLoginMessages() {
		return loginMessages;
	}

	public void setLoginMessages(List<LoginMessageUI> loginMessages) {
		this.loginMessages = loginMessages;
	}

}
