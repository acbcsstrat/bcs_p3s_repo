package com.bcs.p3s.scrape.model;

import java.util.Date;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

@RooJavaBean
@RooToString
@RooJpaActiveRecord
public class Events {
	
	private String code;
	
	private String lastRenewalPayDate;
	
	private Integer renewalYear;
	
	private String procDescription;
	
	public Events() {
		super();
	}

	public Events(String code,String lastRenewalPayDate, Integer renewalYear, String procDescription) {
		super();
		this.code = code;
		this.lastRenewalPayDate = lastRenewalPayDate;
		this.renewalYear = renewalYear;
		this.procDescription = procDescription;
	}

	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	
	public String getLastRenewalPayDate() {
		return lastRenewalPayDate;
	}

	public void setLastRenewalPayDate(String lastRenewalPayDate) {
		this.lastRenewalPayDate = lastRenewalPayDate;
	}

	public Integer getRenewalYear() {
		return renewalYear;
	}

	public void setRenewalYear(Integer renewalYear) {
		this.renewalYear = renewalYear;
	}
	
	public String getProcDescription() {
		return procDescription;
	}

	public void setProcDescription(String procDescription) {
		this.procDescription = procDescription;
	}

}
