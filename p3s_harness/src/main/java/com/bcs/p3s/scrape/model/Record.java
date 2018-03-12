/**
 * 
 */
package com.bcs.p3s.scrape.model;

import java.util.Date;
import java.util.List;

/**
 * @author MerinP
 *
 */
public class Record {
	
	
	private String patentApplicationNumber;
	
	private String title;

	private String filingDate;
	
	private String epoPatentStatus;
	
	private String patentPublicationNumber;
	
	private List<Applicants> applicants;
	
	private List<Events> events;
	
	private List<Agent> representativesList;
	
	private List<IPClassification> ipcCodes;
	

	public String getPatentApplicationNumber() {
		return patentApplicationNumber;
	}

	public void setPatentApplicationNumber(String patentApplicationNumber) {
		this.patentApplicationNumber = patentApplicationNumber;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFilingDate() {
		return filingDate;
	}

	public void setFilingDate(String filingDate) {
		this.filingDate = filingDate;
	}

	public String getEpoPatentStatus() {
		return epoPatentStatus;
	}

	public void setEpoPatentStatus(String epoPatentStatus) {
		this.epoPatentStatus = epoPatentStatus;
	}


	public String getPatentPublicationNumber() {
		return patentPublicationNumber;
	}

	public void setPatentPublicationNumber(String patentPublicationNumber) {
		this.patentPublicationNumber = patentPublicationNumber;
	}

	public List<Applicants> getApplicants() {
		return applicants;
	}

	public void setApplicants(List<Applicants> applicants) {
		this.applicants = applicants;
	}

	public List<Events> getEvents() {
		return events;
	}

	public void setEvents(List<Events> events) {
		this.events = events;
	}


	public List<Agent> getRepresentativesList() {
		return representativesList;
	}

	public void setRepresentativesList(List<Agent> representativesList) {
		this.representativesList = representativesList;
	}

	public List<IPClassification> getIpcCodes() {
		return ipcCodes;
	}

	public void setIpcCodes(List<IPClassification> ipcCodes) {
		this.ipcCodes = ipcCodes;
	}

	

	
	
}
