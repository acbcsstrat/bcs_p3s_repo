package com.bcs.p3s.display.form1200;

import java.util.List;

/**
 * An object to hold the v2.1 API 2.2 (Generate & Save FORM1200) Incoming Request data
 */
public class GenerateForm1200DataIn {

	protected long patentId;
	//protected String EP_ApplicationNumber;
	protected String clientRef;
	protected int totalClaims;
	protected boolean isYear3RenewalPaying;
	protected int totalPages;
	protected List<ExtensionStateUI> extensionStatesUI;
	protected List<ValidationStateUI>  validationStatesUI;
	protected List<PageDescriptionUI> pageDescriptionsUI;
	
	
	
	// Ordinary getters & setters
	
	public long getPatentId() {
		return patentId;
	}
	public void setPatentId(long patentId) {
		this.patentId = patentId;
	}
	public String getClientRef() {
		return clientRef;
	}
	public void setClientRef(String clientRef) {
		this.clientRef = clientRef;
	}
	public int getTotalClaims() {
		return totalClaims;
	}
	public void setTotalClaims(int totalClaims) {
		this.totalClaims = totalClaims;
	}
	public boolean isYear3RenewalPaying() {
		return isYear3RenewalPaying;
	}
	public void setYear3RenewalPaying(boolean isYear3RenewalPaying) {
		this.isYear3RenewalPaying = isYear3RenewalPaying;
	}
	public int getTotalPages() {
		return totalPages;
	}
	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}
	public List<ExtensionStateUI> getExtensionStatesUI() {
		return extensionStatesUI;
	}
	public void setExtensionStatesUI(List<ExtensionStateUI> extensionStatesUI) {
		this.extensionStatesUI = extensionStatesUI;
	}
	public List<ValidationStateUI> getValidationStatesUI() {
		return validationStatesUI;
	}
	public void setValidationStatesUI(List<ValidationStateUI> validationStatesUI) {
		this.validationStatesUI = validationStatesUI;
	}
	public List<PageDescriptionUI> getPageDescriptionsUI() {
		return pageDescriptionsUI;
	}
	public void setPageDescriptionsUI(List<PageDescriptionUI> pageDescriptionUI) {
		this.pageDescriptionsUI = pageDescriptionUI;
	}
}
