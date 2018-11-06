package com.bcs.p3s.display;

import java.util.List;

public class PortfolioUI {
	
	private Long id;
	private String EP_ApplicationNumber;
	private String clientRef;
	private String shortTitle;
	private String epoStatus;
	private String epeStage;
	private String serviceStatus;  // Tmp fix: Portfolio has no data to distinguish RenewalInPlace vs RenewalNotNeeded etc (as no Service, as nothing to sell)
								// Hence Pat 181106 requests this tmp fix: provide patent:renewalStatus or patent:epctStatus – depending upon Stage
								// Tmp, because will need amending once we can sell >1 item per patent (v2.3ish?)
	private List<P3SService> serviceList;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
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
	public String getServiceStatus() {
		return serviceStatus;
	}
	public void setServiceStatus(String serviceStatus) {
		this.serviceStatus = serviceStatus;
	}
	public List<P3SService> getServiceList() {
		return serviceList;
	}
	public void setServiceList(List<P3SService> serviceList) {
		this.serviceList = serviceList;
	}

}
