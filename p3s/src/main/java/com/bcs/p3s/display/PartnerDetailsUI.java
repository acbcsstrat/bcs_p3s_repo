package com.bcs.p3s.display;

/**
 * Provides details of our partner patent company
 * (for 'Call Us' functionality 
 */
public class PartnerDetailsUI {

	protected String partnerName;
	protected String partnerPhone;

	
	public PartnerDetailsUI(String companyName, String callUsPhoneNumber) {
		setPartnerName(companyName);
		setPartnerPhone(callUsPhoneNumber);
	}
	
	
	
	public String getPartnerName() {
		return partnerName;
	}
	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}
	public String getPartnerPhone() {
		return partnerPhone;
	}
	public void setPartnerPhone(String partnerPhone) {
		this.partnerPhone = partnerPhone;
	}
	
}
