package com.bcs.p3s.docs.htmldoc.model;

import com.bcs.p3s.model.Certificate;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

public class HtmlDocCertificate extends Universal {

	protected String renewingOrganisation;
	protected PostalAddressAndHyperlink ourAddress;
	protected String clientBusinessName;
	protected String patentApplicationNumber;  
	protected String patentTitle;
	protected String ourClientsShortTitleForPatent;
	protected String ourClientsReferenceForTheirClient;
	protected String patentPublicationNumber;  
	protected String patentApplicantName;
	protected String patentFilingDate;
	protected String EpoPatentYearInPlace; 
	protected String EpoPatentRenewedOnDate;
	protected String certificateNumber;   
	protected String certificateIssueDate;

	
	public HtmlDocCertificate(Renewal renewal) {
		if (renewal==null || renewal.getCertificate()==null) fail("HtmlDocCertificate constructor given null");
		Patent patent = renewal.getPatent();
		Certificate certificate = renewal.getCertificate(); 
		DateUtil dateUtil = new DateUtil();

		
		// Set members
		renewingOrganisation = "EPO";
		ourAddress = new PostalAddressAndHyperlink(); // Default constructor defaults to our address
		clientBusinessName = patent.getBusiness().getBusinessName(); 
		patentApplicationNumber = patent.getPatentApplicationNumber(); 
		patentTitle = patent.getTitle();
		ourClientsShortTitleForPatent = patent.getShortTitle();
		ourClientsReferenceForTheirClient = patent.getClientRef();
		patentPublicationNumber = patent.getPatentPublicationNumber();  
		patentApplicantName = patent.getPrimaryApplicantName();
		patentFilingDate = dateUtil.dateToUSStringWithDayOfWeek(patent.getFilingDate());
		EpoPatentYearInPlace = patent.getLastRenewedYearEpo().toString();
		EpoPatentRenewedOnDate = dateUtil.dateToUSStringWithDayOfWeek(patent.getLastRenewedDateExEpo());
		certificateNumber = certificate.getId().toString();
		certificateIssueDate = dateUtil.dateToUSStringWithoutDayOfWeek(certificate.getIssueDate());
	}
	
	
	
	// Routine getters & setters
	public String getRenewingOrganisation() {
		return renewingOrganisation;
	}
	public void setRenewingOrganisation(String renewingOrganisation) {
		this.renewingOrganisation = renewingOrganisation;
	}
	public PostalAddressAndHyperlink getOurAddress() {
		return ourAddress;
	}
	public void setOurAddress(PostalAddressAndHyperlink ourAddress) {
		this.ourAddress = ourAddress;
	}
	public String getClientBusinessName() {
		return clientBusinessName;
	}
	public void setClientBusinessName(String clientBusinessName) {
		this.clientBusinessName = clientBusinessName;
	}
	public String getPatentApplicationNumber() {
		return patentApplicationNumber;
	}
	public void setPatentApplicationNumber(String patentApplicationNumber) {
		this.patentApplicationNumber = patentApplicationNumber;
	}
	public String getPatentTitle() {
		return patentTitle;
	}
	public void setPatentTitle(String patentTitle) {
		this.patentTitle = patentTitle;
	}
	public String getOurClientsShortTitleForPatent() {
		return ourClientsShortTitleForPatent;
	}
	public void setOurClientsShortTitleForPatent(String ourClientsShortTitleForPatent) {
		this.ourClientsShortTitleForPatent = ourClientsShortTitleForPatent;
	}
	public String getOurClientsReferenceForTheirClient() {
		return ourClientsReferenceForTheirClient;
	}
	public void setOurClientsReferenceForTheirClient(String ourClientsReferenceForTheirClient) {
		this.ourClientsReferenceForTheirClient = ourClientsReferenceForTheirClient;
	}
	public String getPatentPublicationNumber() {
		return patentPublicationNumber;
	}
	public void setPatentPublicationNumber(String patentPublicationNumber) {
		this.patentPublicationNumber = patentPublicationNumber;
	}
	public String getPatentApplicantName() {
		return patentApplicantName;
	}
	public void setPatentApplicantName(String patentApplicantName) {
		this.patentApplicantName = patentApplicantName;
	}
	public String getPatentFilingDate() {
		return patentFilingDate;
	}
	public void setPatentFilingDate(String patentFilingDate) {
		this.patentFilingDate = patentFilingDate;
	}
	public String getEpoPatentYearInPlace() {
		return EpoPatentYearInPlace;
	}
	public void setEpoPatentYearInPlace(String epoPatentYearInPlace) {
		EpoPatentYearInPlace = epoPatentYearInPlace;
	}
	public String getEpoPatentRenewedOnDate() {
		return EpoPatentRenewedOnDate;
	}
	public void setEpoPatentRenewedOnDate(String epoPatentRenewedOnDate) {
		EpoPatentRenewedOnDate = epoPatentRenewedOnDate;
	}
	public String getCertificateNumber() {
		return certificateNumber;
	}
	public void setCertificateNumber(String certificateNumber) {
		this.certificateNumber = certificateNumber;
	}
	public String getCertificateIssueDate() {
		return certificateIssueDate;
	}
	public void setCertificateIssueDate(String certificateIssueDate) {
		this.certificateIssueDate = certificateIssueDate;
	}
	
}
