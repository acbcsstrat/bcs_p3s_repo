package com.bcs.p3s.display;

import java.math.BigDecimal;

import javax.persistence.Column;

import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.util.currency.CurrencyUtil;



public class RenewalFeeUI extends FeeCurrencyComponents {
	
	private BigDecimal renewalFeeEUR;
    
    private BigDecimal extensionFeeEUR;
    
    private BigDecimal renewalFeeUSD;
    
    private BigDecimal extensionFeeUSD;
   
    private BigDecimal processingFeeUSD;
    
    private BigDecimal expressFeeUSD;

    private BigDecimal urgentFeeUSD;
    
    private BigDecimal latePayPenaltyUSD;

    @Column(precision = 12, scale = 6)
    private BigDecimal fxRate;

    private BigDecimal subTotalUSD;
    
    // & provide to FE anyway, just in case are useful
    private BigDecimal processingFeeEUR;
    private BigDecimal expressFeeEUR;
    private BigDecimal urgentFeeEUR;
    private BigDecimal latePayPenaltyEUR;
    private BigDecimal subTotalEUR;
    
    private String feeActiveDate;

    protected CostHistoryUI costHistoryUI;

	
	
	public RenewalFeeUI(RenewalFee fee) {

		// Map RenewalFee fields to equivalent fields here. 

		BigDecimal dollarsfor1EuroRate = fee.getFxRate(); // how-many-dollars-to-buy-one-Euro

		this.setRenewalFeeEUR(fee.getRenewalFee_EUR());
		this.setExtensionFeeEUR(fee.getExtensionFee_EUR());
		this.setProcessingFeeUSD(fee.getProcessingFee_USD());
		this.setExpressFeeUSD(fee.getExpressFee_USD());
		this.setUrgentFeeUSD(fee.getUrgentFee_USD());
		//this.setLatePayPenaltyUSD(fee.getLatePayPenalty_USD());
		this.setFxRate(CurrencyUtil.invertRate(dollarsfor1EuroRate));		// For FE. WhatEurosDoes1DollarBuy - i.e. = ~0.8
		checkRateFeasable(dollarsfor1EuroRate);
		this.setSubTotalUSD(fee.getSubTotal_USD());
		
		this.setRenewalFeeUSD((fee.getRenewalFee_EUR().multiply(fee.getFxRate())).setScale(2, BigDecimal.ROUND_HALF_UP));
		this.setExtensionFeeUSD((fee.getExtensionFee_EUR().multiply(fee.getFxRate())).setScale(2, BigDecimal.ROUND_HALF_UP));

		CurrencyUtil currencyUtil = new CurrencyUtil();

		this.setProcessingFeeEUR(currencyUtil.dollarsToEuro(processingFeeUSD, dollarsfor1EuroRate));
		this.setExpressFeeEUR(currencyUtil.dollarsToEuro(expressFeeUSD, dollarsfor1EuroRate));
		this.setUrgentFeeEUR(currencyUtil.dollarsToEuro(urgentFeeUSD, dollarsfor1EuroRate));
		this.setLatePayPenaltyEUR(currencyUtil.dollarsToEuro(latePayPenaltyUSD, dollarsfor1EuroRate));
		this.setSubTotalEUR(currencyUtil.dollarsToEuro(subTotalUSD, dollarsfor1EuroRate));

		// Populate costHistoryUI
		setDollarComponentUSD();
		setEuroComponentEUR(dollarsfor1EuroRate);
		costHistoryUI = new CostHistoryUI(this);
	}



	// Implement the 2 abstract methods from supertype
	public void setDollarComponentUSD() {
		BigDecimal totalling = processingFeeUSD; 
		totalling = safeAddition(totalling, expressFeeUSD);
		totalling = safeAddition(totalling, urgentFeeUSD);
		totalling = safeAddition(totalling, latePayPenaltyUSD);
		dollarComponentUSD = totalling;
	}
	public void setEuroComponentEUR(BigDecimal dollarsfor1EuroRate) {
		BigDecimal totalling = renewalFeeEUR; 
		totalling = safeAddition(totalling, extensionFeeEUR);
		euroComponentEUR = totalling; 

		currentOfficialFeeUSD = euroComponentEUR.multiply(dollarsfor1EuroRate);
	}



	
	// Start of Legacy / Redundant getters - to be removed soon, while/incase FrontEnd still uses them. FE to migrate to non-underscore naming, WITH currencyIdentification. // acToDo 01-sep-2017 {intention still valid 17-oct-2018}

	public BigDecimal getRenewalFee_EUR() {
		return renewalFeeEUR;
	}
	
	public BigDecimal getExtensionFee_EUR() {
		return extensionFeeEUR;
	}
	
	public BigDecimal getRenewalFee_USD() {
		return renewalFeeUSD;
	}
	
	public BigDecimal getExtensionFee_USD() {
		return extensionFeeUSD;
	}
	
	public BigDecimal getProcessingFee_USD() {
		return processingFeeUSD;
	}
	
	public BigDecimal getExpressFee_USD() {
		return expressFeeUSD;
	}
	
	public BigDecimal getUrgentFee_USD() {
		return urgentFeeUSD;
	}
	
	public BigDecimal getLatePayPenalty_USD() {
		return latePayPenaltyUSD;
	}
	
	public BigDecimal getSubTotal_USD() {
		return subTotalUSD;
	}
	
	// End of Legacy / Redundant getters - to be removed soon, while/incase FrontEnd still uses them. FE to migrate to non-underscore naming, WITH currencyIdentification.
	
	
	
	
	// Ordinary getters/setters
	
	public BigDecimal getRenewalFeeEUR() {
		return renewalFeeEUR;
	}

	public void setRenewalFeeEUR(BigDecimal renewalFeeEUR) {
		this.renewalFeeEUR = renewalFeeEUR;
	}

	public BigDecimal getExtensionFeeEUR() {
		return extensionFeeEUR;
	}

	public void setExtensionFeeEUR(BigDecimal extensionFeeEUR) {
		this.extensionFeeEUR = extensionFeeEUR;
	}

	public BigDecimal getRenewalFeeUSD() {
		return renewalFeeUSD;
	}

	public void setRenewalFeeUSD(BigDecimal renewalFeeUSD) {
		this.renewalFeeUSD = renewalFeeUSD;
	}

	public BigDecimal getExtensionFeeUSD() {
		return extensionFeeUSD;
	}

	public void setExtensionFeeUSD(BigDecimal extensionFeeUSD) {
		this.extensionFeeUSD = extensionFeeUSD;
	}

	public BigDecimal getProcessingFeeUSD() {
		return processingFeeUSD;
	}

	public void setProcessingFeeUSD(BigDecimal processingFeeUSD) {
		this.processingFeeUSD = processingFeeUSD;
	}

	public BigDecimal getExpressFeeUSD() {
		return expressFeeUSD;
	}

	public void setExpressFeeUSD(BigDecimal expressFeeUSD) {
		this.expressFeeUSD = expressFeeUSD;
	}

	public BigDecimal getUrgentFeeUSD() {
		return urgentFeeUSD;
	}

	public void setUrgentFeeUSD(BigDecimal urgentFeeUSD) {
		this.urgentFeeUSD = urgentFeeUSD;
	}

	public BigDecimal getLatePayPenaltyUSD() {
		return latePayPenaltyUSD;
	}

	public void setLatePayPenaltyUSD(BigDecimal latePayPenaltyUSD) {
		this.latePayPenaltyUSD = latePayPenaltyUSD;
	}

	public BigDecimal getFxRate() {
		return fxRate;
	}

	public void setFxRate(BigDecimal fxRate) {
		this.fxRate = fxRate;
	}

	public BigDecimal getSubTotalUSD() {
		return subTotalUSD;
	}

	public void setSubTotalUSD(BigDecimal subTotalUSD) {
		this.subTotalUSD = subTotalUSD;
	}
    
    
	
	public BigDecimal getProcessingFeeEUR() {
		return processingFeeEUR;
	}
	public void setProcessingFeeEUR(BigDecimal processingFeeEUR) {
		this.processingFeeEUR = processingFeeEUR;
	}

	public BigDecimal getExpressFeeEUR() {
		return expressFeeEUR;
	}
	public void setExpressFeeEUR(BigDecimal expressFeeEUR) {
		this.expressFeeEUR = expressFeeEUR;
	}

	public BigDecimal getUrgentFeeEUR() {
		return urgentFeeEUR;
	}
	public void setUrgentFeeEUR(BigDecimal urgentFeeEUR) {
		this.urgentFeeEUR = urgentFeeEUR;
	}

	public BigDecimal getLatePayPenaltyEUR() {
		return latePayPenaltyEUR;
	}
	public void setLatePayPenaltyEUR(BigDecimal latePayPenaltyEUR) {
		this.latePayPenaltyEUR = latePayPenaltyEUR;
	}


	public BigDecimal getSubTotalEUR() {
		return subTotalEUR;
	}
	public void setSubTotalEUR(BigDecimal subTotalEUR) {
		this.subTotalEUR = subTotalEUR;
	}


	public String getFeeActiveDate() {
		return feeActiveDate;
	}
	public void setFeeActiveDate(String feeActiveDate) {
		this.feeActiveDate = feeActiveDate;
	}

	public CostHistoryUI getCostHistoryUI() {
		return costHistoryUI;
	}
	public void setCostHistoryUI(CostHistoryUI costHistoryUI) {
		this.costHistoryUI = costHistoryUI;
	}

	

}
