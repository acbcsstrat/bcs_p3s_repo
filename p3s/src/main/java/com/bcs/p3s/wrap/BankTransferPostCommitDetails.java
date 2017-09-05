package com.bcs.p3s.wrap;

import com.bcs.p3s.display.PatentUI;

/**
 * Created for API action 4.3 - Checkout – Bank Transfer after Commit
 */
public class BankTransferPostCommitDetails extends BankTransferPreCommitDetails {

	protected String p3sTransRef;

	protected BankTransferPaymentDetails bankTransferPaymentDetails; 
	
	protected String proformaInvoiceUrl;
	
	protected String billingStreet;
	
	protected String billingCity;
	
	protected String billingState;
	
	protected Long billingZip;
	
	/**
	 * Ignore if empty. Else is a warning that the price has changed since the last page. 
	 * UI can chose what action to take.
	 * Carries a message suitable for display to user.
	 */
	protected String warningMessage;


	
	public BankTransferPostCommitDetails() {
	}
	
	
	
	
	
	
	
	
	// Ordinary getters & setters
	public String getP3sTransRef() {
		return p3sTransRef;
	}

	public void setP3sTransRef(String p3sTransRef) {
		this.p3sTransRef = p3sTransRef;
	}

	public BankTransferPaymentDetails getBankTransferPaymentDetails() {
		return bankTransferPaymentDetails;
	}

	public void setBankTransferPaymentDetails(BankTransferPaymentDetails bankTransferPaymentDetails) {
		this.bankTransferPaymentDetails = bankTransferPaymentDetails;
	}

	public String getProformaInvoiceUrl() {
		return proformaInvoiceUrl;
	}

	public void setProformaInvoiceUrl(String proformaInvoiceUrl) {
		this.proformaInvoiceUrl = proformaInvoiceUrl;
	}

	public String getWarningMessage() {
		return warningMessage;
	}

	public void setWarningMessage(String warningMessage) {
		this.warningMessage = warningMessage;
	}
	
	public String getBillingStreet() {
		return billingStreet;
	}

	public void setBillingStreet(String billingStreet) {
		this.billingStreet = billingStreet;
	}

	public String getBillingCity() {
		return billingCity;
	}

	public void setBillingCity(String billingCity) {
		this.billingCity = billingCity;
	}

	public String getBillingState() {
		return billingState;
	}

	public void setBillingState(String billingState) {
		this.billingState = billingState;
	}

	public Long getBillingZip() {
		return billingZip;
	}

	public void setBillingZip(Long billingZip) {
		this.billingZip = billingZip;
	}

	// convenience, for debugging & logging
	public String toString() {
		String CRLF = "\n";
		String tos = "BankTransferPostCommitDetails is:"+CRLF;
		String patentIDs = "  PatentIDs are";
		for (PatentUI pui : orderedPatentUIs) {
			patentIDs += ", "+pui.getId();
		}
		tos += patentIDs+CRLF;
		tos += totalCostUSD+CRLF;
		tos += "dateNowLocalTime="+dateNowLocalTime+CRLF;
		tos += dateNowLocalTimeUI+CRLF;
		tos += "transTargetEndDate="+transTargetEndDate+CRLF;
		tos += transTargetEndDateUI+CRLF;
		
		tos += "p3sTransRef="+p3sTransRef+CRLF;
		tos += bankTransferPaymentDetails.toString() +CRLF;
		tos += "proformaInvoiceUrl="+proformaInvoiceUrl+CRLF;
		tos += "warningMessage="+warningMessage+CRLF;
		
		return tos;
	}

}
