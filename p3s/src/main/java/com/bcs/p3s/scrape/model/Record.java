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
	
	private List<ApplicantData> applicantsData;
	
	private List<Events> events;
	
	private List<AgentData> agentData;
	
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


	public List<ApplicantData> getApplicantsData() {
		return applicantsData;
	}

	public void setApplicantsData(List<ApplicantData> applicantsData) {
		this.applicantsData = applicantsData;
	}

	public List<Events> getEvents() {
		return events;
	}

	public void setEvents(List<Events> events) {
		this.events = events;
	}

	public List<AgentData> getAgentData() {
		return agentData;
	}

	public void setAgentData(List<AgentData> agentData) {
		this.agentData = agentData;
	}

	public List<IPClassification> getIpcCodes() {
		return ipcCodes;
	}

	public void setIpcCodes(List<IPClassification> ipcCodes) {
		this.ipcCodes = ipcCodes;
	}

	

	
	
}
