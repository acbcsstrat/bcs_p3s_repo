package com.bcs.p3s.display;

import java.util.List;

public class PortfolioUI {
	
	private String EP_ApplicationNumber;
	private String clientRef;
	private String shortTitle;
	private String epoStatus;
	private String epeStage;
	private List<Service> serviceList;
	
	
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
	public String getShortTitle() {
		return shortTitle;
	}
	public void setShortTitle(String shortTitle) {
		this.shortTitle = shortTitle;
	}
	public String getEpoStatus() {
		return epoStatus;
	}
	public void setEpoStatus(String epoStatus) {
		this.epoStatus = epoStatus;
	}
	public String getEpeStage() {
		return epeStage;
	}
	public void setEpeStage(String epeStage) {
		this.epeStage = epeStage;
	}
	public List<Service> getServiceList() {
		return serviceList;
	}
	public void setServiceList(List<Service> serviceList) {
		this.serviceList = serviceList;
	}
	
	
	

}
