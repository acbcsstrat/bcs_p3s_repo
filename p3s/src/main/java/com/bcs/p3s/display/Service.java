package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;

import com.bcs.p3s.util.date.DateUtil;

public class Service {
	
	private String serviceType;
	private String serviceStatus;
	private String currentStageColour;
	private String nextStageColour;
	private BigDecimal currentStageCostUSD;
	private BigDecimal nextStageCostUSD;
	private Date costBandEndDate;
	private String failedReason;
	
	public String getServiceType() {
		return serviceType;
	}
	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}
	public String getServiceStatus() {
		return serviceStatus;
	}
	public void setServiceStatus(String serviceStatus) {
		this.serviceStatus = serviceStatus;
	}
	public String getCurrentStageColour() {
		return currentStageColour;
	}
	public void setCurrentStageColour(String currentStageColour) {
		this.currentStageColour = currentStageColour;
	}
	public String getNextStageColour() {
		return nextStageColour;
	}
	public void setNextStageColour(String nextStageColour) {
		this.nextStageColour = nextStageColour;
	}
	public BigDecimal getCurrentStageCostUSD() {
		return currentStageCostUSD;
	}
	public void setCurrentStageCostUSD(BigDecimal currentStageCostUSD) {
		this.currentStageCostUSD = currentStageCostUSD;
	}
	public BigDecimal getNextStageCostUSD() {
		return nextStageCostUSD;
	}
	public void setNextStageCostUSD(BigDecimal nextStageCostUSD) {
		this.nextStageCostUSD = nextStageCostUSD;
	}
	public Date getCostBandEndDate() {
		return costBandEndDate;
	}
	public void setCostBandEndDate(Date costBandEndDate) {
		this.costBandEndDate = costBandEndDate;
	}
	public String getFailedReason() {
		return failedReason;
	}
	public void setFailedReason(String failedReason) {
		this.failedReason = failedReason;
	}
	
	public String getCostBandEndDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.costBandEndDate);
		return res;
	}

}
