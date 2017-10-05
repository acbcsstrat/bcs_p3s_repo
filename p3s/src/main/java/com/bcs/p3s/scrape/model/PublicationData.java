package com.bcs.p3s.scrape.model;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class PublicationData {
	
	private String countryCode;
	private String publicationNumber;
	
	
	
	public PublicationData() {
		super();
	}



	public PublicationData(String countryCode, String publicationNumber) {
		super();
		this.countryCode = countryCode;
		this.publicationNumber = publicationNumber;
	}



	public String getCountryCode() {
		return countryCode;
	}



	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}



	public String getPublicationNumber() {
		return publicationNumber;
	}



	public void setPublicationNumber(String publicationNumber) {
		this.publicationNumber = publicationNumber;
	}
	
	
	
	
	

}
