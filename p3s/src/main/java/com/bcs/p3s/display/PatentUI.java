package com.bcs.p3s.display;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.DateUtil;

/**
 * Agreed 6th June 2017 that a request for multiple patents would include, within each patent, 
 * all the reuired data for the 'view patent' page.
 * Hence this extended class contains all the notifications, et al
 * 
 * @author andyc
 *
 */
public class PatentUI extends Patent {

    private BigDecimal currentRenewalCost;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date costBandEndDate;

    private BigDecimal renewalCostNextStage;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "MMM-dd-yyyy")
    private Date renewalDueDate;


	
	public PatentUI(Patent patent) {
		DummyDataEngine dummy = new DummyDataEngine();
		System.out.println("Calling DummyDataEngine:populateExtendedFieldsWithDummyData for patent "+patent.getPatentApplicationNumber());
    	dummy.populateExtendedFieldsWithDummyData(this, patent);
	}

    

	
	
	
	// Getter/setters that return String version of typed fields - for UI convenience
	public String getLastRenewedDateExEpoUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getLastRenewedDateExEpo());
		return res;
	}
	public String getFilingDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.getFilingDate());
		return res;
	}
	public String getCostBandEndDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.costBandEndDate);
		return res;
	}
	public String getRenewalDueDateUI() {
		String res = (new DateUtil()).dateToUSStringWithDayOfWeek(this.renewalDueDate);
		return res;
	}
	
	
	
	// Ordinary getters/setters
	
	public BigDecimal getCurrentRenewalCost() {
		return currentRenewalCost;
	}

	public void setCurrentRenewalCost(BigDecimal currentRenewalCost) {
		this.currentRenewalCost = currentRenewalCost;
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
}
