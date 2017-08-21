package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.List;

public class InBasket {
	
	// fields for API section 4.1
		public List<Long> patentIds;
		
		// Here are the ADDITIONAL fields for API section 4.2
		public BigDecimal expectedCost;

		// Here are the ADDITIONAL fields for API section 4.3
		public String billingAddressStreet;
		public String billingAddressCity;
		public String billingAddressState;
		public Long billingAddressZip;
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
		public String getBillingAddressStreet() {
			return billingAddressStreet;
		}
		public void setBillingAddressStreet(String billingAddressStreet) {
			this.billingAddressStreet = billingAddressStreet;
		}
		public String getBillingAddressCity() {
			return billingAddressCity;
		}
		public void setBillingAddressCity(String billingAddressCity) {
			this.billingAddressCity = billingAddressCity;
		}
		public String getBillingAddressState() {
			return billingAddressState;
		}
		public void setBillingAddressState(String billingAddressState) {
			this.billingAddressState = billingAddressState;
		}
		public Long getBillingAddressZip() {
			return billingAddressZip;
		}
		public void setBillingAddressZip(Long billingAddressZip) {
			this.billingAddressZip = billingAddressZip;
		}

		
		

}
