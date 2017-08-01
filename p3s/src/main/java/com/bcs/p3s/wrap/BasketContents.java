package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.bcs.p3s.display.PatentUI;

public class BasketContents {

	protected List<PatentUI> orderedPatentUIs = new ArrayList<PatentUI>();

	protected BigDecimal totalCostUSD;
	
	protected String firstName;
	
	protected String lastName;
	
	protected String billingStreet;
	
	protected String billingCity;
	
	protected String billingState;
	
	protected Long billingZip;
	
	protected Date dateNowLocalTime;
	protected String  dateNowLocalTimeUI;

	
	
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
	public Long getBillingZip() {
		return billingZip;
	}
	public void setBillingZip(Long billingZip) {
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

	
	// convenience, for debugging & logging
	public String toString() {
		String CRLF = " :: \n";
		String tos = "BasketContents is:"+CRLF;
		tos += "BasketContents is:"+CRLF;
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
		return tos;
	}

	
}
