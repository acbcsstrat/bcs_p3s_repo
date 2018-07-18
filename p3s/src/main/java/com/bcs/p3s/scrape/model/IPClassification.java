package com.bcs.p3s.scrape.model;


import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;


public class IPClassification {
	
	
	private String ipcCodes;
	private String changeDate;
	
	
	public String getIpcCodes() {
		return ipcCodes;
	}

	public void setIpcCodes(String ipcCodes) {
		this.ipcCodes = ipcCodes;
	}

	public String getChangeDate() {
		return changeDate;
	}

	public void setChangeDate(String changeDate) {
		this.changeDate = changeDate;
	}
	
	
	
}
