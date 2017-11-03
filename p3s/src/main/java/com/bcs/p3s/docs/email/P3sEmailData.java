package com.bcs.p3s.docs.email;

/**
 * This holds all the Injectable data that a P3sEmail may require.
 * Builders populate those parts of this, as required,
 *  then create the P3sEmail populating with data from this.
 *
 */
public class P3sEmailData {

	String supportEmailAddress;
	String loginUrl;
	String urlToVerifyEmail;
	
	String firstname; 
	String lastname;

	String companyName; 
	String companyCode;
	String companyPin;

	
	
	// regular getters & setters
	
	public String getSupportEmailAddress() {
		return supportEmailAddress;
	}
	public void setSupportEmailAddress(String supportEmailAddress) {
		this.supportEmailAddress = supportEmailAddress;
	}
	public String getLoginUrl() {
		return loginUrl;
	}
	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}
	public String getUrlToVerifyEmail() {
		return urlToVerifyEmail;
	}
	public void setUrlToVerifyEmail(String urlToVerifyEmail) {
		this.urlToVerifyEmail = urlToVerifyEmail;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getCompanyCode() {
		return companyCode;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	public String getCompanyPin() {
		return companyPin;
	}
	public void setCompanyPin(String companyPin) {
		this.companyPin = companyPin;
	}
	
}
