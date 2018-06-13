package com.bcs.p3s.scrape.model;

import java.util.ArrayList;
import java.util.List;
import com.bcs.p3s.scrape.model.Inventors;

public class Form1200Record {
	
	private String appNumber;
	
	private List<Applicants> applicants;
	
	private List<Inventors> inventors;
	
	private String filingDate;
	
	private String priorityDate;
	
	private String filingLang;
	
	private String publicationNumber;
	
	private String publishedDate;
	
	private String publishedLang;
	
	private String searchReportPublishedOn;
	
	private List<IPClassification> ipcCodes;
	
	private String title;
	
	private ArrayList<String> designatedContractingStates;
	
	private String[] allClaims;
	
	private String abstractTxt;

	public String getAppNumber() {
		return appNumber;
	}

	public void setAppNumber(String appNumber) {
		this.appNumber = appNumber;
	}


	public List<Applicants> getApplicants() {
		return applicants;
	}

	public void setApplicants(List<Applicants> applicants) {
		this.applicants = applicants;
	}

	public List<Inventors> getInventors() {
		return inventors;
	}

	public void setInventors(List<Inventors> inventors) {
		this.inventors = inventors;
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

	public String getFilingLang() {
		return filingLang;
	}

	public void setFilingLang(String filingLang) {
		this.filingLang = filingLang;
	}

	
	public String getPublicationNumber() {
		return publicationNumber;
	}

	public void setPublicationNumber(String publicationNumber) {
		this.publicationNumber = publicationNumber;
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

	public String getSearchReportPublishedOn() {
		return searchReportPublishedOn;
	}

	public void setSearchReportPublishedOn(String searchReportPublishedOn) {
		this.searchReportPublishedOn = searchReportPublishedOn;
	}
	
	public List<IPClassification> getIpcCodes() {
		return ipcCodes;
	}

	public void setIpcCodes(List<IPClassification> ipcCodes) {
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
