package com.bcs.p3s.display.form1200;

import com.bcs.p3s.display.Form1200FeeUI;

/**
 * Collects together the data to send back to the FE when the customer has 
 * completed entering the form1200 questions - & pressed the save/generatePdf button
 * 
 */
public class Form1200SavedData {

	protected long patentId;
	protected String EP_ApplicationNumber;
	protected String form1200PdfUrl;
	protected Form1200FeeUI form1200FeeUI;


	
	// Ordinary Getters & Setters
	
	public long getPatentId() {
		return patentId;
	}
	public String getEP_ApplicationNumber() {
		return EP_ApplicationNumber;
	}
	public String getForm1200PdfUrl() {
		return form1200PdfUrl;
	}
	public Form1200FeeUI getForm1200FeeUI() {
		return form1200FeeUI;
	}
	public void setPatentId(long patentId) {
		this.patentId = patentId;
	}
	public void setEP_ApplicationNumber(String eP_ApplicationNumber) {
		EP_ApplicationNumber = eP_ApplicationNumber;
	}
	public void setForm1200PdfUrl(String form1200PdfUrl) {
		this.form1200PdfUrl = form1200PdfUrl;
	}
	public void setForm1200FeeUI(Form1200FeeUI form1200FeeUI) {
		this.form1200FeeUI = form1200FeeUI;
	}
}
