package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;

import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.util.date.DateUtil;

// This class formerly called Service (as defined by the API document). But that clashed with the Spring class

/**
 * v2.1 introduces the concept of each portfolio item containing a list of services.
 * Each service provides data that the FE may need to display on the Portfolio view.
 * 
 * It's an oversimplification to regard each service as being something what we can sell now, for this patent.
 *  That view is flawed as we sometimes need provide a Service, to show status values, 
 *  	even when we know we cannot sell (say 'too late', or 'already in progress')
 *  
 *  For v2.1 Any PortfolioUI will have either 1 or 0 Services. Any Service will be a Form1200 or a Renewal
 */
public class P3SService {
	
	private String serviceType;
	private String serviceStatus;
	private String currentStageColour = RenewalColourEnum.GREY;
	private String nextStageColour = RenewalColourEnum.GREY;
	private BigDecimal currentStageCostUSD = new BigDecimal("0.0");
	private BigDecimal nextStageCostUSD = new BigDecimal("0.0");
	private Date costBandEndDate;
	private String failedReason;

	
	
	
	// Getter/setters that return String version of typed fields - for UI convenience

	public String getCostBandEndDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.costBandEndDate);
		return res;
	}

	// Ordinary getters/setters

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
}
