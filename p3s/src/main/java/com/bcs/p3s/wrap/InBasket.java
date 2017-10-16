package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.List;

public class InBasket {
	
	// fields for API section 4.1
		public List<Long> patentIds;
		
		// Here are the ADDITIONAL fields for API section 4.2
		public BigDecimal expectedCost;

		// Here are the ADDITIONAL fields for API section 4.3
		public String billingStreet;
		public String billingCity;
		public String billingState;
		public String billingZip;
		public List<Long> getPatentIds() {
			return patentIds;
		}
		public void setPatentIds(List<Long> patentIds) {
			this.patentIds = patentIds;
		}
		public BigDecimal getExpectedCost() {
			return expectedCost;
		}
		public void setExpectedCost(BigDecimal expectedCost) {
			this.expectedCost = expectedCost;
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
		
		
		
		

}
