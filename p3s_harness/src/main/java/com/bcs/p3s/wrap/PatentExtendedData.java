package com.bcs.p3s.wrap;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.model.Fee;

/**
 * Created for storing non DB data being calculated prior to display the dash board
 * @author MerinP
 *
 */

public class PatentExtendedData {
	
	private Long patentId;
	
	private Boolean canRenew;
	
	private BigDecimal currentRenewalCost;
	
	private Fee fee;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date costBandEndDate;

    private BigDecimal renewalCostNextStage;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date renewalDueDate;
    
    private String currentCostBand;
    
    private Integer activeRenewalYear;
    
    private String currentRenewalStatus;

    
	public Long getPatentId() {
		return patentId;
	}

	public void setPatentId(Long patentId) {
		this.patentId = patentId;
	}

	
	public Boolean getCanRenew() {
		return canRenew;
	}

	public void setCanRenew(Boolean canRenew) {
		this.canRenew = canRenew;
	}

	public BigDecimal getCurrentRenewalCost() {
		return currentRenewalCost;
	}

	public void setCurrentRenewalCost(BigDecimal currentRenewalCost) {
		this.currentRenewalCost = currentRenewalCost;
	}

	

	public Fee getFee() {
		return fee;
	}

	public void setFee(Fee fee) {
		this.fee = fee;
	}

	public Date getCostBandEndDate() {
		return costBandEndDate;
	}

	public void setCostBandEndDate(Date costBandEndDate) {
		this.costBandEndDate = costBandEndDate;
	}

	public BigDecimal getRenewalCostNextStage() {
		return renewalCostNextStage;
	}

	public void setRenewalCostNextStage(BigDecimal renewalCostNextStage) {
		this.renewalCostNextStage = renewalCostNextStage;
	}

	public Date getRenewalDueDate() {
		return renewalDueDate;
	}

	public void setRenewalDueDate(Date renewalDueDate) {
		this.renewalDueDate = renewalDueDate;
	}

	public String getCurrentCostBand() {
		return currentCostBand;
	}

	public void setCurrentCostBand(String currentCostBand) {
		this.currentCostBand = currentCostBand;
	}

	public Integer getActiveRenewalYear() {
		return activeRenewalYear;
	}

	public void setActiveRenewalYear(Integer activeRenewalYear) {
		this.activeRenewalYear = activeRenewalYear;
	}

	public String getCurrentRenewalStatus() {
		return currentRenewalStatus;
	}

	public void setCurrentRenewalStatus(String currentRenewalStatus) {
		this.currentRenewalStatus = currentRenewalStatus;
	}
    
    
    

}
