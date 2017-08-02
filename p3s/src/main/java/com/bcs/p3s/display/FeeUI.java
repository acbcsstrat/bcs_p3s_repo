package com.bcs.p3s.display;

import java.math.BigDecimal;

import com.bcs.p3s.model.Fee;



public class FeeUI {
	
	private BigDecimal renewalFee_EUR;
    
    private BigDecimal extensionFee_EUR;
    
    private BigDecimal renewalFee_USD;
    
    private BigDecimal extensionFee_USD;
   
    private BigDecimal processingFee_USD;
    
    private BigDecimal expressFee_USD;

    private BigDecimal urgentFee_USD;
    
    private BigDecimal latePayPenalty_USD;

    private BigDecimal fxRate;

    private BigDecimal subTotal_USD;
    
    
    

	
	
	public FeeUI(Fee fee){
		
	}

	public BigDecimal getRenewalFee_EUR() {
		return renewalFee_EUR;
	}

	public void setRenewalFee_EUR(BigDecimal renewalFee_EUR) {
		this.renewalFee_EUR = renewalFee_EUR;
	}

	public BigDecimal getExtensionFee_EUR() {
		return extensionFee_EUR;
	}

	public void setExtensionFee_EUR(BigDecimal extensionFee_EUR) {
		this.extensionFee_EUR = extensionFee_EUR;
	}

	
	public FeeUI(BigDecimal renewalFee_EUR, BigDecimal extensionFee_EUR, BigDecimal renewalFee_USD,
			BigDecimal extensionFee_USD, BigDecimal processingFee_USD, BigDecimal expressFee_USD,
			BigDecimal urgentFee_USD, BigDecimal latePayPenalty_USD, BigDecimal fxRate, BigDecimal subTotal_USD) {
		super();
		this.renewalFee_EUR = renewalFee_EUR;
		this.extensionFee_EUR = extensionFee_EUR;
		this.renewalFee_USD = renewalFee_USD;
		this.extensionFee_USD = extensionFee_USD;
		this.processingFee_USD = processingFee_USD;
		this.expressFee_USD = expressFee_USD;
		this.urgentFee_USD = urgentFee_USD;
		this.latePayPenalty_USD = latePayPenalty_USD;
		this.fxRate = fxRate;
		this.subTotal_USD = subTotal_USD;
	}

	public BigDecimal getRenewalFee_USD() {
		return renewalFee_USD;
	}

	public void setRenewalFee_USD(BigDecimal renewalFee_USD) {
		this.renewalFee_USD = renewalFee_USD;
	}

	public BigDecimal getExtensionFee_USD() {
		return extensionFee_USD;
	}

	public void setExtensionFee_USD(BigDecimal extensionFee_USD) {
		this.extensionFee_USD = extensionFee_USD;
	}

	public BigDecimal getProcessingFee_USD() {
		return processingFee_USD;
	}

	public void setProcessingFee_USD(BigDecimal processingFee_USD) {
		this.processingFee_USD = processingFee_USD;
	}

	public BigDecimal getExpressFee_USD() {
		return expressFee_USD;
	}

	public void setExpressFee_USD(BigDecimal expressFee_USD) {
		this.expressFee_USD = expressFee_USD;
	}

	public BigDecimal getUrgentFee_USD() {
		return urgentFee_USD;
	}

	public void setUrgentFee_USD(BigDecimal urgentFee_USD) {
		this.urgentFee_USD = urgentFee_USD;
	}

	public BigDecimal getLatePayPenalty_USD() {
		return latePayPenalty_USD;
	}

	public void setLatePayPenalty_USD(BigDecimal latePayPenalty_USD) {
		this.latePayPenalty_USD = latePayPenalty_USD;
	}

	public BigDecimal getFxRate() {
		return fxRate;
	}

	public void setFxRate(BigDecimal fxRate) {
		this.fxRate = fxRate;
	}

	public BigDecimal getSubTotal_USD() {
		return subTotal_USD;
	}

	public void setSubTotal_USD(BigDecimal subTotal_USD) {
		this.subTotal_USD = subTotal_USD;
	}
    
    

}
