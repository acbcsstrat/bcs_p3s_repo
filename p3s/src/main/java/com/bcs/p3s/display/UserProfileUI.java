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
public class UserProfileUI extends Business {

	// The 4 fields from P3SUser
    private String firstName;
    private String lastName;
    private String emailAddress;


	
	public UserProfileUI() {
		//DummyDataEngine dummy = new DummyDataEngine();
		
		P3SUser myUser = SecurityUtil.getMyUser();
    	Business myBusiness = SecurityUtil.getMyBusiness();

    	// Fields from P3SUser
    	this.setFirstName(myUser.getFirstName());
    	this.setLastName(myUser.getLastName());
    	this.setEmailAddress(myUser.getEmailAddress());
    	
    	// Fields from Business
    	this.setBusinessName(myBusiness.getBusinessName());
    	this.setPhoneNumber(myBusiness.getPhoneNumber());
    	this.setTimezone(myBusiness.getTimezone());
    	this.setStreet(myBusiness.getStreet());
    	this.setCity(myBusiness.getCity());
    	this.setUSstate(myBusiness.getUSstate());
    	this.setZip(myBusiness.getZip());
    	this.setBillingStreet(myBusiness.getBillingStreet());
    	this.setBillingCity(myBusiness.getBillingCity());
    	this.setBillingState(myBusiness.getBillingState());
    	this.setBillingZip(myBusiness.getBillingZip());
    	this.setIsBillingAddressSame(myBusiness.getIsBillingAddressSame());
    	this.setBusinessNumber(myBusiness.getBusinessNumber());
	
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

}
