package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.Form1200FeeUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.RenewalFeeUI;
import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.util.lang.Universal;

/**
 * Created for API action 4.1 - Show basket details
 */
public class BasketContents extends Universal {

	protected List<PatentUI> orderedPatentUIs = new ArrayList<PatentUI>();

	protected BigDecimal totalCostUSD;
	
	protected String firstName;
	
	protected String lastName;
	
	protected String billingStreet;
	
	protected String billingCity;
	
	protected String billingState;
	
	protected String billingZip;
	
	protected Date dateNowLocalTime;
	protected String  dateNowLocalTimeUI;
	
	// Extend for v2.1 - E-PCT - to hold totals of cost breakdowns
	protected BigDecimal totalOfficialFeesUSD = BigDecimal.ZERO;
	//protected BigDecimal totalEpoSurchargesUSD = BigDecimal.ZERO;
	protected BigDecimal totalProcessingFeesUSD = BigDecimal.ZERO;
	protected BigDecimal totalExpressFeesUSD = BigDecimal.ZERO;
	protected BigDecimal totalUrgentFeesUSD = BigDecimal.ZERO;
	

	

	/**
	 * This new, shortlived, for v2.1
	 * Given a renewal pricing, add to the breakdown totals
	 * @param eachSessionData
	 */
	public void addRenewalFeesToBreakdownTotals(PatentExtendedData aSessionData) {
		String err = CLASSNAME +"addRenewalToBreakdownTotals() : ";
		if (aSessionData==null) fail(err+"passed a null instead of renewal pricing within a aSessionData");

		RenewalFee renewalFee = aSessionData.getFee();
		if (renewalFee==null) fail(err+"renewalFee object within aSessionData is null");
		
		RenewalFeeUI renewalFeeUI = new RenewalFeeUI(renewalFee);
		
		BigDecimal officialFeeUSD = renewalFeeUI.getEuroComponentUSD(renewalFee.getFxRate());
		BigDecimal processingFeeUSD = renewalFeeUI.getProcessingFee_USD();
		BigDecimal expressFeeUSD = renewalFeeUI.getExpressFee_USD();
		BigDecimal urgentFeeUSD = renewalFeeUI.getUrgentFee_USD();
		
		totalOfficialFeesUSD = totalOfficialFeesUSD.add(officialFeeUSD);
		totalProcessingFeesUSD = totalProcessingFeesUSD.add(processingFeeUSD);
		totalExpressFeesUSD = totalExpressFeesUSD.add(expressFeeUSD);
		totalUrgentFeesUSD = totalUrgentFeesUSD.add(urgentFeeUSD); 
	}
	
	/**
	 * Given an Epct application in the basket, add its component fees to the breakdown totals
	 * @param aSessionData
	 */
	public void addEpctFeesToBreakdownTotals(Form1200Fee form1200Fee) {
		String err = CLASSNAME +"addEpctFeesToBreakdownTotals() : ";
		if (form1200Fee==null) fail(err+"passed a null instead of a form1200Fee");

		Form1200FeeUI form1200FeeUI = new Form1200FeeUI(form1200Fee);
		
		BigDecimal officialFeeUSD = form1200FeeUI.getEuroComponentUSD(form1200Fee.getFxRate());
		BigDecimal processingFeeUSD = form1200FeeUI.getProcessingFeeUSD();
		BigDecimal expressFeeUSD = form1200FeeUI.getExpressFeeUSD();
		BigDecimal urgentFeeUSD = form1200FeeUI.getUrgentFeeUSD();
		
		totalOfficialFeesUSD = totalOfficialFeesUSD.add(officialFeeUSD);
		totalProcessingFeesUSD = totalProcessingFeesUSD.add(processingFeeUSD);
		totalExpressFeesUSD = totalExpressFeesUSD.add(expressFeeUSD);
		totalUrgentFeesUSD = totalUrgentFeesUSD.add(urgentFeeUSD); 
	}

	
	
	// convenience, for debugging & logging
	public String toString() {
		String CRLF = "\n";
		String tos = "BasketContents is:"+CRLF;
		String patentIDs = "  PatentIDs are";
		for (PatentUI pui : orderedPatentUIs) {
			patentIDs += ", "+pui.getId();
		}
		tos += patentIDs+CRLF;
		tos += totalCostUSD+CRLF;
		tos += firstName+CRLF;
		tos += lastName+CRLF;
		tos += billingStreet+CRLF;
		tos += billingCity+CRLF;
		tos += 	billingState+CRLF;
		tos += billingZip+CRLF;
		tos += dateNowLocalTime+CRLF;
		tos += dateNowLocalTimeUI+CRLF;
		return tos;
	}

	// Ordinary getters & setters

	public List<PatentUI> getOrderedPatentUIs() {
		return orderedPatentUIs;
	}
	public void setOrderedPatentUIs(List<PatentUI> orderedPatentUIs) {
		this.orderedPatentUIs = orderedPatentUIs;
	}
	public BigDecimal getTotalCostUSD() {
		return totalCostUSD;
	}
	public void setTotalCostUSD(BigDecimal totalCostUSD) {
		this.totalCostUSD = totalCostUSD;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
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
	public String getBillingZip() {
		return billingZip;
	}
	public void setBillingZip(String billingZip) {
		this.billingZip = billingZip;
	}
	public Date getDateNowLocalTime() {
		return dateNowLocalTime;
	}
	public void setDateNowLocalTime(Date dateNowLocalTime) {
		this.dateNowLocalTime = dateNowLocalTime;
	}
	public String getDateNowLocalTimeUI() {
		return dateNowLocalTimeUI;
	}
	public void setDateNowLocalTimeUI(String dateNowLocalTimeUI) {
		this.dateNowLocalTimeUI = dateNowLocalTimeUI;
	}
	public BigDecimal getTotalOfficialFeesUSD() {
		return totalOfficialFeesUSD;
	}
	public void setTotalOfficialFeesUSD(BigDecimal totalOfficialFeesUSD) {
		this.totalOfficialFeesUSD = totalOfficialFeesUSD;
	}
	//public BigDecimal getTotalEpoSurchargesUSD() {
	//	return totalEpoSurchargesUSD;
	//}
	//public void setTotalEpoSurchargesUSD(BigDecimal totalEpoSurchargesUSD) {
	//	this.totalEpoSurchargesUSD = totalEpoSurchargesUSD;
	//}
	public BigDecimal getTotalProcessingFeesUSD() {
		return totalProcessingFeesUSD;
	}
	public void setTotalProcessingFeesUSD(BigDecimal totalProcessingFeesUSD) {
		this.totalProcessingFeesUSD = totalProcessingFeesUSD;
	}
	public BigDecimal getTotalExpressFeesUSD() {
		return totalExpressFeesUSD;
	}
	public void setTotalExpressFeesUSD(BigDecimal totalExpressFeesUSD) {
		this.totalExpressFeesUSD = totalExpressFeesUSD;
	}
	public BigDecimal getTotalUrgentFeesUSD() {
		return totalUrgentFeesUSD;
	}
	public void setTotalUrgentFeesUSD(BigDecimal totalUrgentFeesUSD) {
		this.totalUrgentFeesUSD = totalUrgentFeesUSD;
	}
	
}
