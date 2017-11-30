package com.bcs.p3s.model;

import javax.validation.constraints.NotNull;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;

@RooJavaBean
@RooToString
@RooJpaActiveRecord(finders = { "findPatentStatusNoRenewalNeededsByStatusText_OPS" })
public class PatentStatusNoRenewalNeeded {
	
	/**
	 * Status text in epo.org	 
	 * */
	@NotNull
	private String statusText_EPO;
	
	/**
	 * Status text from OPS WebService	 
	 * */
	@NotNull
	private String statusText_OPS;
	
	
}