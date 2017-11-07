package com.bcs.p3s.docs.email;

import java.util.List;

import com.bcs.p3s.model.Patent;
import com.bcs.p3s.wrap.TwoColRecord;

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
	String urlToFaq;
	
	// User and Company details
	String firstname; 
	String lastname;
	String companyName; 
	String companyCode;
	String companyPin;
	
	// Patent and renewal timing details
	String timeBeforeChangePhrase;
	String patentApplicationNumber;
	String patentTitle;
	String patentShortTitle;
	String patentClientRef;
	String price;
	String timestampOfNextColourChange;

	
	// Transaction details
	String transactionReference;
	String timestampTargetFundsArrivel;
	String numberOfPatents; 
	List<Patent> patents;
	List<TwoColRecord> paymentDetails;
	String fieldb; 
	String fieldc; 
	
	// Special getters
	public String getCRLF() { return "\n"; }
	public String getTxtForEachPatent() { return ", for each patent,"; }
	
	
	
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
	public String getUrlToFaq() {
		return urlToFaq;
	}
	public void setUrlToFaq(String urlToFaq) {
		this.urlToFaq = urlToFaq;
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
	public String getTimeBeforeChangePhrase() {
		return timeBeforeChangePhrase;
	}
	public void setTimeBeforeChangePhrase(String timeBeforeChangePhrase) {
		this.timeBeforeChangePhrase = timeBeforeChangePhrase;
	}
	public String getPatentApplicationNumber() {
		return patentApplicationNumber;
	}
	public void setPatentApplicationNumber(String patentApplicationNumber) {
		this.patentApplicationNumber = patentApplicationNumber;
	}
	public String getPatentTitle() {
		return patentTitle;
	}
	public void setPatentTitle(String patentTitle) {
		this.patentTitle = patentTitle;
	}
	public String getPatentShortTitle() {
		return patentShortTitle;
	}
	public void setPatentShortTitle(String patentShortTitle) {
		this.patentShortTitle = patentShortTitle;
	}
	public String getPatentClientRef() {
		return patentClientRef;
	}
	public void setPatentClientRef(String patentClientRef) {
		this.patentClientRef = patentClientRef;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getTimestampOfNextColourChange() {
		return timestampOfNextColourChange;
	}
	public void setTimestampOfNextColourChange(String timestampOfNextColourChange) {
		this.timestampOfNextColourChange = timestampOfNextColourChange;
	}
	public String getTransactionReference() {
		return transactionReference;
	}
	public void setTransactionReference(String transactionReference) {
		this.transactionReference = transactionReference;
	}
	public String getTimestampTargetFundsArrivel() {
		return timestampTargetFundsArrivel;
	}
	public void setTimestampTargetFundsArrivel(String timestampTargetFundsArrivel) {
		this.timestampTargetFundsArrivel = timestampTargetFundsArrivel;
	}
	public String getNumberOfPatents() {
		return numberOfPatents;
	}
	public void setNumberOfPatents(String numberOfPatents) {
		this.numberOfPatents = numberOfPatents;
	}
	public List<Patent> getPatents() {
		return patents;
	}
	public void setPatents(List<Patent> patents) {
		this.patents = patents;
	}
	public List<TwoColRecord> getPaymentDetails() {
		return paymentDetails;
	}
	public void setPaymentDetails(List<TwoColRecord> paymentDetails) {
		this.paymentDetails = paymentDetails;
	}
	public String getFieldb() {
		return fieldb;
	}
	public void setFieldb(String fieldb) {
		this.fieldb = fieldb;
	}
	public String getFieldc() {
		return fieldc;
	}
	public void setFieldc(String fieldc) {
		this.fieldc = fieldc;
	}
	
}
