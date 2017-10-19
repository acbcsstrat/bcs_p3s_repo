package com.bcs.p3s.scrape.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

public class ApplicationData {
	
	private String countryCode;
	private String filingDate;
	
	
	
	public ApplicationData() {
		super();
	}
	
	
	public ApplicationData(String countryCode, String filingDate) {
		super();
		this.countryCode = countryCode;
		this.filingDate = filingDate;
	}


	public String getCountryCode() {
		return countryCode;
	}
	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
	public String getFilingDate() {
		return filingDate;
	}
	public void setFilingDate(String filingDate) {
		this.filingDate = filingDate;
	}

}
