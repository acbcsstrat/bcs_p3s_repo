package com.bcs.p3s.scrape.model;

import javax.persistence.CascadeType;
import javax.persistence.EntityManager;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Applicants {
	
	private String applicantName;
	
	private String applicantAddress1;
	private String applicantAddress2;
	private String country;
	
	
	public Applicants() {
		super();
	}
	
	
	
	public Applicants(String applicantName, String applicantAddress1, String applicantAddress2, String country) {
		super();
		this.applicantName = applicantName;
		this.applicantAddress1 = applicantAddress1;
		this.applicantAddress2 = applicantAddress2;
		this.country = country;
		
	}



	public String getApplicantName() {
		return applicantName;
	}
	public void setApplicantName(String applicantName) {
		this.applicantName = applicantName;
	}



	public String getApplicantAddress1() {
		return applicantAddress1;
	}



	public void setApplicantAddress1(String applicantAddress1) {
		this.applicantAddress1 = applicantAddress1;
	}



	public String getApplicantAddress2() {
		return applicantAddress2;
	}



	public void setApplicantAddress2(String applicantAddress2) {
		this.applicantAddress2 = applicantAddress2;
	}



	public String getCountry() {
		return country;
	}



	public void setCountry(String country) {
		this.country = country;
	}
	
	
	

}
