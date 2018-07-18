package com.bcs.p3s.scrape.model;

import java.util.ArrayList;
import java.util.List;
import com.bcs.p3s.scrape.model.Inventors;

public class Form1200Record {
	
	private String EP_AppNumber;
	
	private ApplicantData applicants;
	
	private List<Inventors> inventors;
	
	private AgentData agents;
	
	private String filingDate;
	
	private String priorityDate;
	
	private String filingLang;
	
	private String EP_PublicationNumber;
	
	private String PCT_AppNumber;
	
	private String PCT_PublicationNumber;
	
	private String publishedDate;
	
	private String publishedLang;
	
	//private String searchReportPublishedOn;
	private List<SearchReports> allSearchReports;
	
	private IPClassification ipcCodes;
	
	private String title;
	
	private ArrayList<String> designatedContractingStates;
	
	private String claimsTxt;
	
	private String[] allClaims;
	
	private String abstractTxt;

	

	public String getEP_AppNumber() {
		return EP_AppNumber;
	}

	public void setEP_AppNumber(String eP_AppNumber) {
		EP_AppNumber = eP_AppNumber;
	}

	

	public ApplicantData getApplicants() {
		return applicants;
	}

	public void setApplicants(ApplicantData applicants) {
		this.applicants = applicants;
	}

	public List<Inventors> getInventors() {
		return inventors;
	}

	public void setInventors(List<Inventors> inventors) {
		this.inventors = inventors;
	}
	
	public AgentData getAgents() {
		return agents;
	}

	public void setAgents(AgentData agents) {
		this.agents = agents;
	}

	public String getFilingDate() {
		return filingDate;
	}

	public void setFilingDate(String filingDate) {
		this.filingDate = filingDate;
	}

	public String getPriorityDate() {
		return priorityDate;
	}

	public void setPriorityDate(String priorityDate) {
		this.priorityDate = priorityDate;
	}

	
	public String getEP_PublicationNumber() {
		return EP_PublicationNumber;
	}

	public void setEP_PublicationNumber(String eP_PublicationNumber) {
		EP_PublicationNumber = eP_PublicationNumber;
	}

	public String getPCT_AppNumber() {
		return PCT_AppNumber;
	}

	public void setPCT_AppNumber(String pCT_AppNumber) {
		PCT_AppNumber = pCT_AppNumber;
	}

	public String getPCT_PublicationNumber() {
		return PCT_PublicationNumber;
	}

	public void setPCT_PublicationNumber(String pCT_PublicationNumber) {
		PCT_PublicationNumber = pCT_PublicationNumber;
	}

	public String getFilingLang() {
		return filingLang;
	}

	public void setFilingLang(String filingLang) {
		this.filingLang = filingLang;
	}

	public String getPublishedDate() {
		return publishedDate;
	}

	public void setPublishedDate(String publishedDate) {
		this.publishedDate = publishedDate;
	}

	public String getPublishedLang() {
		return publishedLang;
	}

	public void setPublishedLang(String publishedLang) {
		this.publishedLang = publishedLang;
	}

	/*public String getSearchReportPublishedOn() {
		return searchReportPublishedOn;
	}

	public void setSearchReportPublishedOn(String searchReportPublishedOn) {
		this.searchReportPublishedOn = searchReportPublishedOn;
	}*/
	
	public List<SearchReports> getAllSearchReports() {
		return allSearchReports;
	}

	public void setAllSearchReports(List<SearchReports> allSearchReports) {
		this.allSearchReports = allSearchReports;
	}
	
	public IPClassification getIpcCodes() {
		return ipcCodes;
	}

	public void setIpcCodes(IPClassification ipcCodes) {
		this.ipcCodes = ipcCodes;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}


	public ArrayList<String> getDesignatedContractingStates() {
		return designatedContractingStates;
	}

	public void setDesignatedContractingStates(ArrayList<String> designatedContractingStates) {
		this.designatedContractingStates = designatedContractingStates;
	}

	
	public String getClaimsTxt() {
		return claimsTxt;
	}

	public void setClaimsTxt(String claimsTxt) {
		this.claimsTxt = claimsTxt;
	}

	public String[] getAllClaims() {
		return allClaims;
	}

	public void setAllClaims(String[] allClaims) {
		this.allClaims = allClaims;
	}

	public String getAbstractTxt() {
		return abstractTxt;
	}

	public void setAbstractTxt(String abstractTxt) {
		this.abstractTxt = abstractTxt;
	}

	
}
