package com.bcs.p3s.display.form1200;

import java.util.List;

/**
 * Collects together the data to send to the FE when the customer chooses 
 * to start entering the form1200 questions
 * 
 */
public class StartForm1200Api21UI {

	protected String EP_ApplicationNumber;
	protected String clientRef; 
	protected boolean showOptionalQuestion;
	protected boolean isYear3RenewalDue;
	protected List<ExtensionStateUI> extensionStatesUI;
	protected List<ValidationStateUI> validationStatesUI;


	
	// Ordinary Getters & Setters
	
	public String getEP_ApplicationNumber() {
		return EP_ApplicationNumber;
	}
	public void setEP_ApplicationNumber(String eP_ApplicationNumber) {
		EP_ApplicationNumber = eP_ApplicationNumber;
	}
	public String getClientRef() {
		return clientRef;
	}
	public void setClientRef(String clientRef) {
		this.clientRef = clientRef;
	}
	public boolean isShowOptionalQuestion() {
		return showOptionalQuestion;
	}
	public void setShowOptionalQuestion(boolean showOptionalQuestion) {
		this.showOptionalQuestion = showOptionalQuestion;
	}
	public boolean getIsYear3RenewalDue() {
		return isYear3RenewalDue;
	}
	public void setIsYear3RenewalDue(boolean isYear3RenewalDue) {
		this.isYear3RenewalDue = isYear3RenewalDue;
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
	
}
